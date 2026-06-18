import { useCallback, useEffect, useState, type DependencyList } from "react";

export interface AsyncResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
    setData: (data: T) => void;
}

/**
 * Runs an async function whenever `deps` change and tracks loading/error state.
 *
 * State is only updated once the promise settles — never synchronously inside
 * the effect — which keeps it clear of cascading-render issues. Follows a
 * stale-while-revalidate approach: existing data stays visible during refetch.
 */
export function useAsync<T>(
    fn: () => Promise<T>,
    deps: DependencyList,
    errorMessage = "Something went wrong. Please try again.",
): AsyncResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nonce, setNonce] = useState(0);

    // Called from event handlers (onClick/Retry), so setState here is fine.
    const reload = useCallback(() => {
        setError(null);
        setNonce((n) => n + 1);
    }, []);

    useEffect(() => {
        let active = true;
        fn()
            .then((result) => {
                if (!active) return;
                setData(result);
                setError(null);
            })
            .catch(() => {
                if (active) setError(errorMessage);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
        // `fn` is a fresh closure each render; we key the effect off `deps`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, nonce]);

    return { data, loading, error, reload, setData };
}
