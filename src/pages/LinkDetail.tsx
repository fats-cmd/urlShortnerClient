import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import type { LinkStatus, ShortLink } from "../types/Types";
import { getLink, updateLink, deleteLink } from "../api/services/linksService";
import { useAsync } from "../hooks/useAsync";

// ── Link detail & analytics (route: "/links/:id") ────────────────────────────

const STATUS_STYLES: Record<
    LinkStatus,
    { bg: string; color: string; label: string }
> = {
    active: { bg: "#e8f5e9", color: "var(--forest)", label: "Active" },
    expired: { bg: "#fff3e0", color: "#e65100", label: "Expired" },
    disabled: { bg: "#f5f5f5", color: "#757575", label: "Disabled" },
};

const formatDate = (iso: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "—";

const StatCard = ({ value, label }: { value: string; label: string }) => (
    <div className="card p-5 flex-1 min-w-[140px]">
        <div className="font-display text-2xl font-extrabold text-forest leading-none">
            {value}
        </div>
        <div className="text-xs text-text-muted mt-1.5">{label}</div>
    </div>
);

// Horizontal bar list used for both date and breakdown charts.
const BarList = ({
    title,
    rows,
}: {
    title: string;
    rows: { label: string; value: number }[];
}) => {
    const max = Math.max(1, ...rows.map((r) => r.value));
    return (
        <div className="card p-5">
            <h3 className="font-semibold text-sm text-text-dark mb-4">{title}</h3>
            <div className="flex flex-col gap-2.5">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                        <span className="text-xs text-text-muted w-28 shrink-0 truncate">
                            {r.label}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-fern"
                                style={{ width: `${(r.value / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-text-dark w-10 text-right">
                            {r.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LinkDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [busy, setBusy] = useState(false);
    const [copied, setCopied] = useState(false);

    const {
        data: link,
        loading,
        error,
        setData: setLink,
    } = useAsync<ShortLink>(
        () => getLink(id as string),
        [id],
        "This link could not be found.",
    );

    const handleCopy = () => {
        if (!link) return;
        navigator.clipboard.writeText(link.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleToggleStatus = async () => {
        if (!link) return;
        const next: LinkStatus = link.status === "disabled" ? "active" : "disabled";
        setBusy(true);
        try {
            setLink(await updateLink(link.id, { status: next }));
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!link || !window.confirm("Delete this link permanently?")) return;
        setBusy(true);
        try {
            await deleteLink(link.id);
            navigate("/dashboard", { replace: true });
        } finally {
            setBusy(false);
        }
    };

    return (
        <PageWrapper>
            <div className="mx-auto px-4" style={{ maxWidth: 860 }}>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-fern font-medium mb-4">
                    ← Back to links
                </button>

                {loading && (
                    <div className="text-center py-16">
                        <div className="small-spinner mx-auto" aria-hidden />
                    </div>
                )}

                {error && !loading && (
                    <div className="alert-error flex items-center justify-between gap-4">
                        <span>{error}</span>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="btn-outline">
                            Go back
                        </button>
                    </div>
                )}

                {!loading && !error && link && (
                    <>
                        {/* ── Header ── */}
                        <div className="card p-6 mb-5">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="min-w-0">
                                    <h1 className="font-display text-xl font-bold text-text-dark truncate">
                                        {link.title ?? link.shortCode}
                                    </h1>
                                    <a
                                        href={link.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-fern font-medium text-sm mt-1 inline-block">
                                        {link.shortUrl}
                                    </a>
                                    <p className="text-text-muted text-xs mt-1 break-all">
                                        → {link.originalUrl}
                                    </p>
                                </div>
                                <span
                                    className="px-2.5 py-[3px] rounded-full font-semibold text-[0.72rem] shrink-0"
                                    style={{
                                        background: STATUS_STYLES[link.status].bg,
                                        color: STATUS_STYLES[link.status].color,
                                    }}>
                                    {STATUS_STYLES[link.status].label}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5">
                                <button onClick={handleCopy} className="btn-outline text-sm font-medium">
                                    {copied ? "Copied!" : "Copy link"}
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={busy || link.status === "expired"}
                                    className="btn-outline text-sm font-medium disabled:opacity-50">
                                    {link.status === "disabled" ? "Enable" : "Disable"}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={busy}
                                    className="text-sm font-medium px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50">
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* ── Stats ── */}
                        <div className="flex gap-4 flex-wrap mb-5">
                            <StatCard
                                value={link.totalClicks.toLocaleString()}
                                label="Total clicks"
                            />
                            <StatCard
                                value={link.uniqueClicks.toLocaleString()}
                                label="Unique visitors"
                            />
                            <StatCard value={formatDate(link.createdAt)} label="Created" />
                            <StatCard
                                value={formatDate(link.expiresAt)}
                                label="Expires"
                            />
                        </div>

                        {/* ── Charts ── */}
                        <div className="grid lg:grid-cols-2 gap-4">
                            <BarList
                                title="Clicks over the last 7 days"
                                rows={link.clicksByDate.map((d) => ({
                                    label: d.date.slice(5),
                                    value: d.clicks,
                                }))}
                            />
                            <BarList
                                title="Top countries"
                                rows={link.clicksByCountry.map((c) => ({
                                    label: c.country,
                                    value: c.clicks,
                                }))}
                            />
                            <BarList
                                title="Devices"
                                rows={link.clicksByDevice.map((d) => ({
                                    label: d.device,
                                    value: d.clicks,
                                }))}
                            />
                            {link.tags.length > 0 && (
                                <div className="card p-5">
                                    <h3 className="font-semibold text-sm text-text-dark mb-4">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {link.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2.5 py-1 rounded-full bg-bg-muted text-text-body">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </PageWrapper>
    );
};

export default LinkDetail;
