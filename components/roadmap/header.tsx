import type React from "react"

interface HeaderProps {
    stats: {
        completed: number
        unlocked: number
        total: number
    }
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
    return (
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-full p-4 md:px-8 md:py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">DevTalles Roadmap</h1>
                        <p className="text-sm text-muted-foreground">Tu ruta estructurada de aprendizaje</p>
                    </div>

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
    )
}
