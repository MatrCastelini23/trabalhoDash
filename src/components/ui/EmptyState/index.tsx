interface EmptyStateProps {
    message: string;
    /** Quando true, indica falha ao consultar a API (em vez de “sem dados”). */
    error?: boolean;
}

export function EmptyState({ message, error = false }: EmptyStateProps) {
    return (
        <div
            role={error ? "alert" : undefined}
            className="rounded-2xl border border-dashed border-[#c9d3e6] bg-surface px-6 py-7 text-[15px] text-muted"
        >
            {error ? "Não foi possível carregar os dados agora. Tente novamente em instantes." : message}
        </div>
    );
}
