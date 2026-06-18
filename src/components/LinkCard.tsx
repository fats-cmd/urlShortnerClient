import { useNavigate } from "react-router-dom";
import type { ShortLink } from "../types/Types";

interface Props {
    link: ShortLink;
}

const STATUS_STYLES: Record<
    ShortLink["status"],
    { bg: string; color: string; label: string }
> = {
    active: { bg: "#e8f5e9", color: "var(--forest)", label: "Active" },
    expired: { bg: "#fff3e0", color: "#e65100", label: "Expired" },
    disabled: { bg: "#f5f5f5", color: "#757575", label: "Disabled" },
};

const LinkCard = ({ link }: Props) => {
    const navigate = useNavigate();
    const status = STATUS_STYLES[link.status];

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link.shortUrl);
    };

    return (
        <div
            onClick={() => navigate(`/links/${link.id}`)}
            className="bg-white border cursor-pointer transition-shadow duration-150 ease-in-out flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:shadow-md hover:-translate-y-0.5"
            style={{ borderColor: 'var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            {/* Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-base flex-shrink-0" style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                🔗
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[var(--text-dark)] truncate">
                    {link.title ?? link.shortCode}
                </div>
                <div className="text-[0.8rem] text-[var(--fern)] font-medium mt-0.5 truncate">
                    {link.shortUrl}
                </div>
                <div className="text-[0.75rem] text-[var(--text-muted)] mt-0.5 truncate hidden sm:block">
                    {link.originalUrl}
                </div>
                {/* Inline clicks on mobile (the dedicated column is hidden below sm) */}
                <div className="text-[0.72rem] text-[var(--text-muted)] mt-0.5 sm:hidden">
                    {link.totalClicks.toLocaleString()} clicks
                </div>
            </div>

            {/* Stats (sm and up) */}
            <div className="hidden sm:flex flex-col items-center flex-shrink-0 min-w-[64px]">
                <span className="font-display text-[1.3rem] font-extrabold text-[var(--forest)] leading-none">
                    {link.totalClicks.toLocaleString()}
                </span>
                <span className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">clicks</span>
            </div>

            {/* Status badge */}
            <div className="px-2.5 py-[3px] rounded-full font-semibold text-[0.72rem] flex-shrink-0" style={{ background: status.bg, color: status.color, letterSpacing: '0.03em' }}>{status.label}</div>

            {/* Copy button */}
            <button
                onClick={handleCopy}
                title="Copy short URL"
                aria-label="Copy short URL"
                className="px-2 py-1 text-sm rounded-sm border flex-shrink-0"
                style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
            >
                Copy
            </button>
        </div>
    );
};

export default LinkCard;
