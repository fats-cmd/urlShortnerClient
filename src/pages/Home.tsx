import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import LinkCard from "../components/LinkCard";
import type { LinkSort, ShortLink } from "../types/Types";
import type { PaginatedResponse } from "../types/Api";
import { listLinks } from "../api/services/linksService";
import { useAsync } from "../hooks/useAsync";

type FilterOption = "all" | "active" | "expired" | "disabled";

const SORT_LABELS: Record<LinkSort, string> = {
    newest: "Newest first",
    oldest: "Oldest first",
    most_clicks: "Most clicks",
};

const Home = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<LinkSort>("newest");
    const [filter, setFilter] = useState<FilterOption>("all");
    const [page, setPage] = useState(1);

    const {
        data,
        loading,
        error,
        reload: fetchLinks,
    } = useAsync<PaginatedResponse<ShortLink>>(
        () => listLinks({ page, limit: 10, sort, status: filter, search }),
        [page, sort, filter, search],
        "Failed to load links. Please try again.",
    );

    const links = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalLinks = data?.total ?? 0;

    // Reset to page 1 when filters change
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleFilter = (value: FilterOption) => {
        setFilter(value);
        setPage(1);
    };

    const handleSort = (value: LinkSort) => {
        setSort(value);
        setPage(1);
    };

    return (
        <PageWrapper>
            <div className="mx-auto px-4" style={{ maxWidth: 860 }}>
                {/* ── Header ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "1.75rem",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}>
                    <div>
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.75rem",
                                fontWeight: 700,
                                color: "var(--text-dark)",
                                margin: 0,
                            }}>
                            Your Links
                        </h1>
                        <p
                            style={{
                                color: "var(--text-muted)",
                                fontSize: "0.875rem",
                                margin: "4px 0 0",
                            }}>
                            {totalLinks} link{totalLinks !== 1 ? "s" : ""} total
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/links/create")}
                        className="py-2 px-3 rounded-md font-semibold"
                        style={{ background: 'var(--forest)', color: 'var(--linen)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                        + Create short link
                    </button>
                </div>

                {/* ── Filters bar ── */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "1.25rem",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}>
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search links…"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="input-base"
                        style={{ maxWidth: 240, fontSize: '0.875rem' }}
                    />

                    {/* Status filter */}
                    <select
                        value={filter}
                        onChange={(e) => handleFilter(e.target.value as FilterOption)}
                        className="input-base"
                        style={{ maxWidth: 140, fontSize: '0.875rem' }}>
                        <option value="all">All status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="disabled">Disabled</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => handleSort(e.target.value as LinkSort)}
                        className="input-base"
                        style={{ maxWidth: 160, fontSize: '0.875rem' }}>
                        {(Object.keys(SORT_LABELS) as LinkSort[]).map(
                            (key) => (
                                <option key={key} value={key}>
                                    {SORT_LABELS[key]}
                                </option>
                            ),
                        )}
                    </select>
                </div>

                {/* ── Content ── */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <div className="small-spinner" aria-hidden />
                    </div>
                )}

                {error && !loading && (
                    <div className="alert-error">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                            <div>{error}</div>
                            <button onClick={fetchLinks} className="btn-outline">Retry</button>
                        </div>
                    </div>
                )}

                {!loading && !error && links.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "5rem 0",
                            color: "var(--text-muted)",
                        }}>
                        <div
                            style={{
                                fontSize: "2.5rem",
                                marginBottom: "1rem",
                            }}>
                            🔗
                        </div>
                        <p
                            style={{
                                fontWeight: 600,
                                color: "var(--text-dark)",
                                marginBottom: 4,
                            }}>
                            No links yet
                        </p>
                        <p style={{ fontSize: "0.875rem" }}>
                            Create your first short link to get started.
                        </p>
                        <button onClick={() => navigate('/links/create')} className="btn-primary mt-2">+ Create short link</button>
                    </div>
                )}

                {!loading && !error && links.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.65rem",
                        }}>
                        {links.map((link) => (
                            <LinkCard key={link.id} link={link} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "2rem",
                        }}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="py-1 px-2 rounded-sm"
                            style={{ fontSize: '0.8rem', border: '1px solid var(--forest)', color: 'var(--forest)', background: 'transparent' }}>
                            ← Prev
                        </button>
                        <span
                            style={{
                                fontSize: "0.85rem",
                                color: "var(--text-muted)",
                                padding: "0 0.5rem",
                            }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="py-1 px-2 rounded-sm"
                            style={{ fontSize: '0.8rem', border: '1px solid var(--forest)', color: 'var(--forest)', background: 'transparent' }}>
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Home;
