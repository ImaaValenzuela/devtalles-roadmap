import type React from "react"
import { CheckCircle2, Lock, Circle, PlayCircle } from "lucide-react"
import { Course } from "@/types/course"
import { CATEGORY_COLORS } from "@/constants/courses"
import { CourseStatus } from "@/hooks/use-roadmap"

interface CourseNodeProps {
    course: Course
    level?: number
    courseStatus: Record<string, CourseStatus>
    hoveredCourse: string | null
    setHoveredCourse: (code: string | null) => void
    cycleStatus: (code: string) => void
    isUnlocked: (course: Course) => boolean
    getMissingPrerequisites: (course: Course) => string
    buildBranches: (course: Course) => Course[]
}

export const CourseNode: React.FC<CourseNodeProps> = ({
    course,
    level = 0,
    courseStatus,
    hoveredCourse,
    setHoveredCourse,
    cycleStatus,
    isUnlocked,
    getMissingPrerequisites,
    buildBranches,
}) => {
    const status = courseStatus[course.codigo]
    const isCompleted = status === "completed"
    const isInProgress = status === "in-progress"

    const isLocked = !isUnlocked(course)
    const children = buildBranches(course)
    const colors = CATEGORY_COLORS[course.origen as keyof typeof CATEGORY_COLORS]
    const missingPrereqs = getMissingPrerequisites(course)

    return (
        <div key={course.codigo} className="flex flex-col items-start">
            <div
                className="relative"
                onMouseEnter={() => isLocked && setHoveredCourse(course.codigo)}
                onMouseLeave={() => setHoveredCourse(null)}
            >
                <button
                    onClick={() => !isLocked && cycleStatus(course.codigo)}
                    disabled={isLocked}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all w-full md:w-64 text-left ${isLocked
                        ? "bg-muted border-dashed border-border cursor-not-allowed opacity-60 grayscale"
                        : isCompleted
                            ? "bg-primary/5 border-primary/20 shadow-sm"
                            : isInProgress
                                ? "bg-blue-500/5 border-blue-500/20 shadow-sm ring-1 ring-blue-500/20"
                                : "bg-card border-border hover:border-primary/50 hover:shadow-md cursor-pointer"
                        }`}
                >
                    <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${colors.dot} ${!isLocked && (isCompleted || isInProgress) ? (isCompleted ? "ring-2 ring-offset-1 ring-green-400" : "ring-2 ring-offset-1 ring-blue-400") : ""}`}
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest truncate">
                            {course.codigo} • {course.duracion}h
                        </p>
                        <p
                            className={`font-medium text-sm leading-tight truncate ${!isLocked && isCompleted ? "text-primary" : !isLocked && isInProgress ? "text-blue-600" : "text-foreground"}`}
                        >
                            {course.nombre}
                        </p>
                    </div>
                    <div className="ml-2">
                        {isLocked ? (
                            <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : isInProgress ? (
                            <PlayCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                        )}
                    </div>
                </button>

                {isLocked && hoveredCourse === course.codigo && missingPrereqs && (
                    <div className="absolute left-0 top-full mt-2 bg-popover text-popover-foreground border border-border text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg">
                        Requiere: <span className="font-semibold text-primary">{missingPrereqs}</span>
                    </div>
                )}
            </div>

            {children.length > 0 && (
                <div className="mt-4 md:mt-6 ml-4 md:ml-12 flex flex-col gap-4 md:gap-6 relative">
                    {/* Connecting line */}
                    <div className="absolute -left-2 md:-left-6 top-0 bottom-0 w-0.5 bg-border" />
                    {children.map((child) => (
                        <CourseNode
                            key={child.codigo}
                            course={child}
                            level={level + 1}
                            courseStatus={courseStatus}
                            hoveredCourse={hoveredCourse}
                            setHoveredCourse={setHoveredCourse}
                            cycleStatus={cycleStatus}
                            isUnlocked={isUnlocked}
                            getMissingPrerequisites={getMissingPrerequisites}
                            buildBranches={buildBranches}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

