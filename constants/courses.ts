import { Course } from "@/types/course"

export const COURSES: Course[] = [
    { codigo: "BAS-101", nombre: "Programación para Principiantes", correlativa: "Ninguna", origen: "Fundamentos", duracion: 8 },
    { codigo: "BAS-102", nombre: "Git + GitHub", correlativa: "BAS-101", origen: "Fundamentos", duracion: 12 },
    { codigo: "BAS-103", nombre: "SOLID y Clean Code", correlativa: "BAS-102", origen: "Fundamentos", duracion: 7 },
    { codigo: "BAS-104", nombre: "SQL de Cero", correlativa: "Ninguna", origen: "Fundamentos", duracion: 16 },
    { codigo: "BAS-105", nombre: "Patrones de Diseño", correlativa: "BAS-103", origen: "Fundamentos", duracion: 10 },
    { codigo: "BAS-106", nombre: "Docker", correlativa: "BAS-104", origen: "Fundamentos", duracion: 14 },
    { codigo: "JS-201", nombre: "JavaScript Moderno", correlativa: "BAS-101", origen: "React / Node", duracion: 21 },
    { codigo: "JS-202", nombre: "TypeScript", correlativa: "JS-201", origen: "React / Node", duracion: 9 },
    { codigo: "FE-301", nombre: "React: De Cero a Experto", correlativa: "JS-202", origen: "Web", duracion: 46 },
    { codigo: "FE-302", nombre: "TailwindCSS + Shadcn", correlativa: "FE-301", origen: "Web", duracion: 2 },
    { codigo: "FE-303", nombre: "React Pro", correlativa: "FE-301", origen: "Web", duracion: 27 },
    { codigo: "FE-304", nombre: "Next.js", correlativa: "FE-303", origen: "Web", duracion: 36 },
    { codigo: "MOB-401", nombre: "React Native Expo", correlativa: "FE-301", origen: "Mobile", duracion: 26 },
    { codigo: "MOB-402", nombre: "Gestión de Estado", correlativa: "FE-301", origen: "Mobile / Web", duracion: 6 },
    { codigo: "BE-501", nombre: "Node.js", correlativa: "JS-202", origen: "Node / Nest", duracion: 38 },
    { codigo: "BE-502", nombre: "NestJS", correlativa: ["BE-501", "BAS-103"], origen: "Node / Nest", duracion: 24 },
    { codigo: "BE-503", nombre: "Nest + GraphQL", correlativa: "BE-502", origen: "Node / Nest", duracion: 19 },
    { codigo: "JAV-601", nombre: "Java: Lenguaje desde Cero", correlativa: "BAS-101", origen: "Java", duracion: 15 },
    { codigo: "JAV-602", nombre: "Java Avanzado", correlativa: ["JAV-601", "BAS-105"], origen: "Java", duracion: 25 },
    { codigo: "JAV-603", nombre: "Spring Boot", correlativa: ["JAV-602", "BAS-104"], origen: "Java", duracion: 36 },
    { codigo: "IA-701", nombre: "n8n + MCP", correlativa: "BE-501", origen: "IA", duracion: 17 },
    { codigo: "IA-702", nombre: "OpenAI / Gemini", correlativa: ["FE-301", "BE-502"], origen: "IA", duracion: 7 },
]

export const CATEGORY_COLORS: Record<string, { dot: string; line: string; text: string }> = {
    Fundamentos: { dot: "bg-blue-600", line: "from-blue-600", text: "text-blue-600" },
    "React / Node": { dot: "bg-purple-600", line: "from-purple-600", text: "text-purple-600" },
    Web: { dot: "bg-cyan-600", line: "from-cyan-600", text: "text-cyan-600" },
    Mobile: { dot: "bg-green-600", line: "from-green-600", text: "text-green-600" },
    "Mobile / Web": { dot: "bg-teal-600", line: "from-teal-600", text: "text-teal-600" },
    "Node / Nest": { dot: "bg-orange-600", line: "from-orange-600", text: "text-orange-600" },
    Java: { dot: "bg-red-600", line: "from-red-600", text: "text-red-600" },
    IA: { dot: "bg-pink-600", line: "from-pink-600", text: "text-pink-600" },
}
