import type React from "react"

export const Footer: React.FC = () => {
    return (
        <div className="border-t border-border bg-muted/20 mt-12">
            <div className="max-w-full px-8 py-6 text-center text-muted-foreground text-xs">
                <p>
                    Haz clic para marcar cursos como completados • Pasa el mouse sobre cursos bloqueados para ver requisitos
                </p>
            </div>
        </div>
    )
}
