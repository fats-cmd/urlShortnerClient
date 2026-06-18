// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY: localStorage-backed mock for the links API.
//
// Mirrors the shape of the real endpoints (see linksService.ts) so pages can be
// built and exercised without a backend. Remove once the API is available.
// ─────────────────────────────────────────────────────────────────────────────

import type { PaginatedResponse } from "../../types/Api";
import type {
    CreateLinkPayload,
    ListLinksParams,
    ShortLink,
    UpdateLinkPayload,
} from "../../types/Types";

const kLinksKey = "__mock_links";
const SHORT_DOMAIN = "https://shortn.link";

// Simulate network latency so loading states are visible in dev.
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const randomCode = (len = 6) =>
    Math.random()
        .toString(36)
        .slice(2, 2 + len);

const read = (): ShortLink[] => {
    try {
        return JSON.parse(localStorage.getItem(kLinksKey) || "null") ?? seed();
    } catch {
        return seed();
    }
};

const write = (links: ShortLink[]): void => {
    localStorage.setItem(kLinksKey, JSON.stringify(links));
};

// ── Seed data ────────────────────────────────────────────────────────────────
const buildSeedLink = (
    overrides: Partial<ShortLink> & Pick<ShortLink, "originalUrl" | "shortCode">,
): ShortLink => {
    const now = Date.now();
    const days = (n: number) => new Date(now - n * 86_400_000).toISOString();
    const total = overrides.totalClicks ?? 0;
    return {
        id: crypto.randomUUID(),
        title: null,
        tags: [],
        status: "active",
        totalClicks: total,
        uniqueClicks: Math.round(total * 0.7),
        expiresAt: null,
        createdAt: days(7),
        updatedAt: days(1),
        clicksByDate: Array.from({ length: 7 }, (_, i) => ({
            date: days(6 - i).slice(0, 10),
            clicks: Math.round((total / 7) * (0.5 + Math.random())),
        })),
        clicksByCountry: [
            { country: "United States", clicks: Math.round(total * 0.45) },
            { country: "Nigeria", clicks: Math.round(total * 0.3) },
            { country: "United Kingdom", clicks: Math.round(total * 0.25) },
        ],
        clicksByDevice: [
            { device: "mobile", clicks: Math.round(total * 0.6) },
            { device: "desktop", clicks: Math.round(total * 0.35) },
            { device: "tablet", clicks: Math.round(total * 0.05) },
        ],
        editHistory: [],
        shortUrl: `${SHORT_DOMAIN}/${overrides.shortCode}`,
        ...overrides,
    };
};

const seed = (): ShortLink[] => {
    const links: ShortLink[] = [
        buildSeedLink({
            originalUrl: "https://anthropic.com/news/claude-opus",
            shortCode: "claude",
            title: "Claude launch announcement",
            tags: ["launch", "ai"],
            totalClicks: 1284,
        }),
        buildSeedLink({
            originalUrl: "https://github.com/Princeguam/urlShortnerClient",
            shortCode: "repo",
            title: "Project repo",
            tags: ["dev"],
            totalClicks: 342,
        }),
        buildSeedLink({
            originalUrl: "https://example.com/promo/black-friday-2025",
            shortCode: "bf2025",
            title: "Black Friday promo",
            tags: ["marketing"],
            status: "expired",
            totalClicks: 87,
        }),
    ];
    write(links);
    return links;
};

// ── Operations ─────────────────────────────────────────────────────────────
export const mockListLinks = async ({
    page = 1,
    limit = 10,
    sort = "newest",
    status = "all",
    search = "",
}: ListLinksParams): Promise<PaginatedResponse<ShortLink>> => {
    await delay();
    let items = read();

    if (status !== "all") items = items.filter((l) => l.status === status);

    const q = search.trim().toLowerCase();
    if (q) {
        items = items.filter(
            (l) =>
                l.originalUrl.toLowerCase().includes(q) ||
                l.shortCode.toLowerCase().includes(q) ||
                (l.title?.toLowerCase().includes(q) ?? false),
        );
    }

    items.sort((a, b) => {
        if (sort === "most_clicks") return b.totalClicks - a.totalClicks;
        const diff = +new Date(a.createdAt) - +new Date(b.createdAt);
        return sort === "oldest" ? diff : -diff;
    });

    const total = items.length;
    const start = (page - 1) * limit;
    return {
        data: items.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
};

export const mockGetLink = async (id: string): Promise<ShortLink> => {
    await delay();
    const link = read().find((l) => l.id === id);
    if (!link) throw new Error("Link not found.");
    return link;
};

export const mockCreateLink = async (
    payload: CreateLinkPayload,
): Promise<ShortLink> => {
    await delay();
    const links = read();
    const shortCode = payload.customCode?.trim() || randomCode();
    if (links.some((l) => l.shortCode === shortCode)) {
        throw new Error("That custom code is already taken.");
    }
    const link = buildSeedLink({
        originalUrl: payload.originalUrl,
        shortCode,
        title: payload.title?.trim() || null,
        tags: payload.tags ?? [],
        expiresAt: payload.expiresAt ?? null,
        totalClicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    write([link, ...links]);
    return link;
};

export const mockUpdateLink = async (
    id: string,
    payload: UpdateLinkPayload,
): Promise<ShortLink> => {
    await delay();
    const links = read();
    const idx = links.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Link not found.");
    const updated: ShortLink = {
        ...links[idx],
        ...payload,
        tags: payload.tags ?? links[idx].tags,
        updatedAt: new Date().toISOString(),
    };
    links[idx] = updated;
    write(links);
    return updated;
};

export const mockDeleteLink = async (id: string): Promise<void> => {
    await delay();
    write(read().filter((l) => l.id !== id));
};
