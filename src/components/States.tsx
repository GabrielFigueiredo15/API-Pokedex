import type { ReactNode } from 'react';

/** Estados genéricos de UI (RNF05 UI): carregando, erro e vazio. */
export function Loading({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="feedback" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  children,
}: {
  message: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="feedback feedback--error" role="alert">
      <p>{message}</p>
      {children}
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="feedback feedback--empty" role="status">
      <p>{message}</p>
    </div>
  );
}
