"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { CheckCircle2, Lock, Circle } from "lucide-react"

interface Course {
  codigo: string
  nombre: string
  correlativa: string | string[]
  origen: string
}

const COURSES: Course[] = [
  { codigo: "BAS-101", nombre: "Programación para Principiantes", correlativa: "Ninguna", origen: "Fundamentos" },
  { codigo: "BAS-102", nombre: "Git + GitHub", correlativa: "BAS-101", origen: "Fundamentos" },
  { codigo: "BAS-103", nombre: "SOLID y Clean Code", correlativa: "BAS-102", origen: "Fundamentos" },
  { codigo: "BAS-104", nombre: "SQL de Cero", correlativa: "Ninguna", origen: "Fundamentos" },
  { codigo: "BAS-105", nombre: "Patrones de Diseño", correlativa: "BAS-103", origen: "Fundamentos" },
  { codigo: "BAS-106", nombre: "Docker", correlativa: "BAS-104", origen: "Fundamentos" },
  { codigo: "JS-201", nombre: "JavaScript Moderno", correlativa: "BAS-101", origen: "React / Node" },
  { codigo: "JS-202", nombre: "TypeScript", correlativa: "JS-201", origen: "React / Node" },
  { codigo: "FE-301", nombre: "React: De Cero a Experto", correlativa: "JS-202", origen: "Web" },
  { codigo: "FE-302", nombre: "TailwindCSS + Shadcn", correlativa: "FE-301", origen: "Web" },
  { codigo: "FE-303", nombre: "React Pro / Next.js", correlativa: "FE-301", origen: "Web" },
  { codigo: "MOB-401", nombre: "React Native Expo", correlativa: "FE-301", origen: "Mobile" },
  { codigo: "MOB-402", nombre: "Gestión de Estado", correlativa: "FE-301", origen: "Mobile / Web" },
  { codigo: "BE-501", nombre: "Node.js", correlativa: "JS-202", origen: "Node / Nest" },
  { codigo: "BE-502", nombre: "NestJS", correlativa: ["BE-501", "BAS-103"], origen: "Node / Nest" },
  { codigo: "BE-503", nombre: "Nest + GraphQL", correlativa: "BE-502", origen: "Node / Nest" },
  { codigo: "JAV-601", nombre: "Java: Lenguaje desde Cero", correlativa: "BAS-101", origen: "Java" },
  { codigo: "JAV-602", nombre: "Java Avanzado", correlativa: ["JAV-601", "BAS-105"], origen: "Java" },
  { codigo: "JAV-603", nombre: "Spring Boot", correlativa: ["JAV-602", "BAS-104"], origen: "Java" },
  { codigo: "IA-701", nombre: "n8n + MCP", correlativa: "BE-501", origen: "IA" },
  { codigo: "IA-702", nombre: "OpenAI / Gemini", correlativa: ["FE-301", "BE-502"], origen: "IA" },
]

const CATEGORY_COLORS: Record<string, { dot: string; line: string; text: string }> = {
  Fundamentos: { dot: "bg-blue-600", line: "from-blue-600", text: "text-blue-600" },
  "React / Node": { dot: "bg-purple-600", line: "from-purple-600", text: "text-purple-600" },
  Web: { dot: "bg-cyan-600", line: "from-cyan-600", text: "text-cyan-600" },
  Mobile: { dot: "bg-green-600", line: "from-green-600", text: "text-green-600" },
  "Mobile / Web": { dot: "bg-teal-600", line: "from-teal-600", text: "text-teal-600" },
  "Node / Nest": { dot: "bg-orange-600", line: "from-orange-600", text: "text-orange-600" },
  Java: { dot: "bg-red-600", line: "from-red-600", text: "text-red-600" },
  IA: { dot: "bg-pink-600", line: "from-pink-600", text: "text-pink-600" },
}

export default function RoadmapPage() {
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



  const getPrerequisites = (course: Course): Course[] => {
    const prereqs = Array.isArray(course.correlativa) ? course.correlativa : [course.correlativa]
    if (prereqs[0] === "Ninguna") return []
    return prereqs.map((p) => courseMap[p]).filter(Boolean)
  }

  const stats = useMemo(() => {
    return {
      completed: completed.size,
      unlocked: COURSES.filter(isUnlocked).length,
      total: COURSES.length,
    }
  }, [completed])

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

  const { roots, buildBranches } = buildTreeStructure()

  const getMissingPrerequisites = (course: Course): string => {
    const prereqs = Array.isArray(course.correlativa) ? course.correlativa : [course.correlativa]
    if (prereqs[0] === "Ninguna") return ""

    const missing = prereqs.filter((p) => !completed.has(p))
    if (missing.length === 0) return ""

    return missing.map((p) => courseMap[p]?.codigo || p).join(", ")
  }

  const renderCourseNode = (course: Course, level = 0): React.ReactNode => {
    const isCompleted = completed.has(course.codigo)
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
            onClick={() => !isLocked && toggleCompletion(course.codigo)}
            disabled={isLocked}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all w-full md:w-64 text-left ${isLocked
              ? "bg-muted border-dashed border-border cursor-not-allowed opacity-60 grayscale"
              : isCompleted
                ? "bg-primary/5 border-primary/20 shadow-sm"
                : "bg-card border-border hover:border-primary/50 hover:shadow-md cursor-pointer"
              }`}
          >
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${colors.dot} ${!isLocked && isCompleted ? "ring-2 ring-offset-1 ring-green-400" : ""}`}
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest truncate">{course.codigo}</p>
              <p
                className={`font-medium text-sm leading-tight truncate ${!isLocked && isCompleted ? "text-primary" : "text-foreground"}`}
              >
                {course.nombre}
              </p>
            </div>
            <div className="ml-2">
              {isLocked ? (
                <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
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
            {children.map((child) => renderCourseNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-full p-4 md:px-8 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">DevTalles Roadmap</h1>
              <p className="text-sm text-muted-foreground">Tu ruta estructurada de aprendizaje</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Completados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.unlocked}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Desbloqueados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Diagram */}
      <div className="p-4 md:px-8 md:py-12 overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 min-w-full md:min-w-max pb-8">
          {roots.length > 0 ? (
            roots.map((root) => (
              <div key={root.codigo} className="flex flex-col gap-6">
                {renderCourseNode(root)}
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>No hay cursos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/20 mt-12">
        <div className="max-w-full px-8 py-6 text-center text-muted-foreground text-xs">
          <p>
            Haz clic para marcar cursos como completados • Pasa el mouse sobre cursos bloqueados para ver requisitos
          </p>
        </div>
      </div>
    </main>
  )
}
