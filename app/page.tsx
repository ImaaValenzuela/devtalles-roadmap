"use client"

import { useRoadmap } from "@/hooks/use-roadmap"
import { Header } from "@/components/roadmap/header"
import { Footer } from "@/components/roadmap/footer"
import { CourseNode } from "@/components/roadmap/node"

export default function RoadmapPage() {
  const {
    courseStatus,
    hoveredCourse,
    setHoveredCourse,
    isUnlocked,
    cycleStatus,
    stats,
    roots,
    buildBranches,
    getMissingPrerequisites,
  } = useRoadmap()

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <Header stats={stats} />

      <div className="p-4 md:px-8 md:py-12 overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 min-w-full md:min-w-max pb-8">
          {roots.length > 0 ? (
            roots.map((root) => (
              <div key={root.codigo} className="flex flex-col gap-6">
                <CourseNode
                  course={root}
                  courseStatus={courseStatus}
                  hoveredCourse={hoveredCourse}
                  setHoveredCourse={setHoveredCourse}
                  cycleStatus={cycleStatus}
                  isUnlocked={isUnlocked}
                  getMissingPrerequisites={getMissingPrerequisites}
                  buildBranches={buildBranches}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>No hay cursos disponibles</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
