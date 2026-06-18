// ─────────────────────────────────────────────────────────────────────────────
// Links data service.
//
// Single entry point the UI uses for link CRUD. Each function branches on the
// USE_MOCK_API flag (src/config.ts): the localStorage mock for backend-less dev,
// or the real axios endpoints once a backend is available.
// ─────────────────────────────────────────────────────────────────────────────

import api from "../axios";
import { USE_MOCK_API } from "../../config";
import type { PaginatedResponse } from "../../types/Api";
import type {
    CreateLinkPayload,
    ListLinksParams,
    ShortLink,
    UpdateLinkPayload,
} from "../../types/Types";
import {
    mockCreateLink,
    mockDeleteLink,
    mockGetLink,
    mockListLinks,
    mockUpdateLink,
} from "../mock/mockLinks";

const toQuery = (params: ListLinksParams): string => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.sort) q.set("sort", params.sort);
    if (params.status && params.status !== "all") q.set("status", params.status);
    if (params.search?.trim()) q.set("search", params.search.trim());
    return q.toString();
};

export const listLinks = async (
    params: ListLinksParams = {},
): Promise<PaginatedResponse<ShortLink>> => {
    if (USE_MOCK_API) return mockListLinks(params);
    const { data } = await api.get<PaginatedResponse<ShortLink>>(
        `/links?${toQuery(params)}`,
    );
    return data;
};

export const getLink = async (id: string): Promise<ShortLink> => {
    if (USE_MOCK_API) return mockGetLink(id);
    const { data } = await api.get<ShortLink>(`/links/${id}`);
    return data;
};

export const createLink = async (
    payload: CreateLinkPayload,
): Promise<ShortLink> => {
    if (USE_MOCK_API) return mockCreateLink(payload);
    const { data } = await api.post<ShortLink>("/links", payload);
    return data;
};

export const updateLink = async (
    id: string,
    payload: UpdateLinkPayload,
): Promise<ShortLink> => {
    if (USE_MOCK_API) return mockUpdateLink(id, payload);
    const { data } = await api.patch<ShortLink>(`/links/${id}`, payload);
    return data;
};

export const deleteLink = async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mockDeleteLink(id);
    await api.delete(`/links/${id}`);
};
