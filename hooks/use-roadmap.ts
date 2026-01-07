"use client"

import { useState, useMemo, useEffect } from "react"
import { Course } from "@/types/course"
import { COURSES } from "@/constants/courses"

export function useRoadmap() {
    const [completed, setCompleted] = useState<Set<string>>(new Set())
    const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    const courseMap = useMemo(() => {
        return Object.fromEntries(COURSES.map((c) => [c.codigo, c]))
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem("roadmap-progress")
        if (saved) {
            try {
                setCompleted(new Set(JSON.parse(saved)))
            } catch (e) {
                console.error("Failed to parse roadmap progress", e)
            }
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("roadmap-progress", JSON.stringify(Array.from(completed)))
        }
    }, [completed, isLoaded])

    const isUnlocked = (course: Course): boolean => {
        if (course.correlativa === "Ninguna") return true
        const prereqs = Array.isArray(course.correlativa) ? course.correlativa : [course.correlativa]
        return prereqs.every((prereq) => {
            const parent = courseMap[prereq]
            return completed.has(prereq) && (parent ? isUnlocked(parent) : false)
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

    const toggleCompletion = (codigo: string) => {
        const newCompleted = new Set(completed)
        if (newCompleted.has(codigo)) {
            newCompleted.delete(codigo)
            // Cascading uncheck: remove all descendants
            const descendants = getDescendants(codigo)
            descendants.forEach((d) => newCompleted.delete(d))
        } else {
            newCompleted.add(codigo)
        }
        setCompleted(newCompleted)
    }

    const stats = useMemo(() => {
        return {
            completed: completed.size,
            unlocked: COURSES.filter((c) => isUnlocked(c)).length,
            total: COURSES.length,
            totalHours: COURSES.reduce((acc, course) => acc + course.duracion, 0),
        }
    }, [completed]) // isUnlocked is stable or should be inside memo if dependent

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

        const missing = prereqs.filter((p) => !completed.has(p))
        if (missing.length === 0) return ""

        return missing.map((p) => courseMap[p]?.codigo || p).join(", ")
    }

    return {
        completed,
        hoveredCourse,
        setHoveredCourse,
        isUnlocked,
        toggleCompletion,
        stats,
        roots,
        buildBranches,
        getMissingPrerequisites,
    }
}
