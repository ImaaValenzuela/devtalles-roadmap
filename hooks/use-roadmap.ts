"use client"

import { useState, useMemo, useEffect } from "react"
import { Course } from "@/types/course"
import { COURSES } from "@/constants/courses"

export type CourseStatus = "in-progress" | "completed"

export function useRoadmap() {
    // Store status as a map: courseCode -> status
    const [courseStatus, setCourseStatus] = useState<Record<string, CourseStatus>>({})
    const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    const courseMap = useMemo(() => {
        return Object.fromEntries(COURSES.map((c) => [c.codigo, c]))
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem("roadmap-progress")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    // Migrate old format (array of completed codes) to new format
                    const newStatus: Record<string, CourseStatus> = {}
                    parsed.forEach((code) => {
                        newStatus[code] = "completed"
                    })
                    setCourseStatus(newStatus)
                } else {
                    // New format
                    setCourseStatus(parsed)
                }
            } catch (e) {
                console.error("Failed to parse roadmap progress", e)
            }
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("roadmap-progress", JSON.stringify(courseStatus))
        }
    }, [courseStatus, isLoaded])

    const isUnlocked = (course: Course): boolean => {
        if (course.correlativa === "Ninguna") return true
        const prereqs = Array.isArray(course.correlativa) ? course.correlativa : [course.correlativa]
        return prereqs.every((prereq) => {
            const parent = courseMap[prereq]
            // Unlocked if parent has ANY status (in-progress or completed)
            // Recursive check: parent must also be unlocked
            return courseStatus[prereq] !== undefined && (parent ? isUnlocked(parent) : false)
        })
    }

    const getDescendants = (courseCode: string): string[] => {
        const descendants: string[] = []
        const children = COURSES.filter((c) => {
            const prereqs = Array.isArray(c.correlativa) ? c.correlativa : [c.correlativa]
            return prereqs.includes(courseCode)
        })

        children.forEach((child) => {
            descendants.push(child.codigo)
            descendants.push(...getDescendants(child.codigo))
        })

        return descendants
    }

    const cycleStatus = (codigo: string) => {
        setCourseStatus((prev) => {
            const current = prev[codigo]
            const next = { ...prev }

            if (!current) {
                next[codigo] = "in-progress"
            } else if (current === "in-progress") {
                next[codigo] = "completed"
            } else {
                delete next[codigo]
                // Cascading removal for descendants if the node is reset
                const descendants = getDescendants(codigo)
                descendants.forEach((d) => delete next[d])
            }
            return next
        })
    }

    const stats = useMemo(() => {
        const completedCount = Object.values(courseStatus).filter(s => s === "completed").length
        return {
            completed: completedCount,
            unlocked: COURSES.filter((c) => isUnlocked(c)).length,
            total: COURSES.length,
            totalHours: COURSES.reduce((acc, course) => acc + course.duracion, 0),
        }
    }, [courseStatus])

    const buildTreeStructure = () => {
        const roots = COURSES.filter((c) => c.correlativa === "Ninguna")

        const buildBranches = (parent: Course): Course[] => {
            return COURSES.filter((c) => {
                const prereqs = Array.isArray(c.correlativa) ? c.correlativa : [c.correlativa]
                return prereqs.includes(parent.codigo)
            })
        }

        return { roots, buildBranches }
    }

    const { roots, buildBranches } = useMemo(() => buildTreeStructure(), [])

    const getMissingPrerequisites = (course: Course): string => {
        const prereqs = Array.isArray(course.correlativa) ? course.correlativa : [course.correlativa]
        if (prereqs[0] === "Ninguna") return ""

        // Missing if NOT present in status map
        const missing = prereqs.filter((p) => !courseStatus[p])
        if (missing.length === 0) return ""

        return missing.map((p) => courseMap[p]?.codigo || p).join(", ")
    }

    return {
        courseStatus,
        hoveredCourse,
        setHoveredCourse,
        isUnlocked,
        cycleStatus, // Renamed from toggleCompletion
        stats,
        roots,
        buildBranches,
        getMissingPrerequisites,
    }
}

