export interface EyeIconProps {
    open: boolean;
}

export type LinkStatus = "active" | "expired" | "disabled";

export interface ClickStat {
    date: string; // ISO date string e.g. "2025-05-01"
    clicks: number;
}

export interface GeoStat {
    country: string;
    clicks: number;
}

export interface DeviceStat {
    device: string; // "mobile" | "desktop" | "tablet"
    clicks: number;
}

export interface LinkEdit {
    id: string;
    editedAt: string; // ISO
    changedFields: string[];
    previousValues: Record<string, string>;
}

export interface ShortLink {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    title: string | null;
    tags: string[];
    status: LinkStatus;
    totalClicks: number;
    uniqueClicks: number;
    expiresAt: string | null; // ISO or null
    createdAt: string;
    updatedAt: string;
    clicksByDate: ClickStat[];
    clicksByCountry: GeoStat[];
    clicksByDevice: DeviceStat[];
    editHistory: LinkEdit[];
}

export type LinkSort = "newest" | "oldest" | "most_clicks";

export interface ListLinksParams {
    page?: number;
    limit?: number;
    sort?: LinkSort;
    status?: LinkStatus | "all";
    search?: string;
}

export interface CreateLinkPayload {
    originalUrl: string;
    title?: string;
    customCode?: string;
    tags?: string[];
    expiresAt?: string | null;
}

export interface UpdateLinkPayload extends Partial<CreateLinkPayload> {
    status?: LinkStatus;
}
