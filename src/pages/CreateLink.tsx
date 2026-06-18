import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import type { CreateLinkPayload, ShortLink } from "../types/Types";
import { createLink } from "../api/services/linksService";

// ── Create short link form (route: "/links/create") ──────────────────────────

interface CreateForm {
    originalUrl: string;
    title: string;
    customCode: string;
    tags: string;
    expiresAt: string;
}

const EMPTY: CreateForm = {
    originalUrl: "",
    title: "",
    customCode: "",
    tags: "",
    expiresAt: "",
};

const isValidUrl = (value: string): boolean => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const CreateLink = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<CreateForm>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [created, setCreated] = useState<ShortLink | null>(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValidUrl(form.originalUrl)) {
            setError("Enter a valid URL starting with http:// or https://");
            return;
        }
        if (form.customCode && !/^[a-zA-Z0-9_-]+$/.test(form.customCode)) {
            setError("Custom code may only contain letters, numbers, - and _.");
            return;
        }

        const payload: CreateLinkPayload = {
            originalUrl: form.originalUrl.trim(),
            title: form.title.trim() || undefined,
            customCode: form.customCode.trim() || undefined,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            expiresAt: form.expiresAt
                ? new Date(form.expiresAt).toISOString()
                : null,
        };

        setSubmitting(true);
        setError("");
        try {
            setCreated(await createLink(payload));
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not create link. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopy = () => {
        if (!created) return;
        navigator.clipboard.writeText(created.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const resetForm = () => {
        setForm(EMPTY);
        setCreated(null);
        setError("");
    };

    return (
        <PageWrapper>
            <div className="mx-auto px-4" style={{ maxWidth: 560 }}>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-fern font-medium mb-4">
                    ← Back to links
                </button>

                <h1 className="font-display text-2xl font-bold text-text-dark mb-1">
                    Create a short link
                </h1>
                <p className="text-text-muted text-sm mb-6">
                    Paste a long URL and customise how it's shared.
                </p>

                {/* ── Success state ── */}
                {created ? (
                    <div className="card p-6">
                        <div className="alert-success mb-4" role="status">
                            ✓ Your short link is ready!
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <a
                                href={created.shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-fern font-semibold break-all">
                                {created.shortUrl}
                            </a>
                        </div>
                        <p className="text-xs text-text-muted break-all mb-5">
                            → {created.originalUrl}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={handleCopy} className="btn-primary text-sm">
                                {copied ? "Copied!" : "Copy link"}
                            </button>
                            <button
                                onClick={() => navigate(`/links/${created.id}`)}
                                className="btn-outline text-sm font-medium">
                                View details
                            </button>
                            <button
                                onClick={resetForm}
                                className="btn-outline text-sm font-medium">
                                Create another
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Form ── */
                    <form onSubmit={handleSubmit} className="card p-6" noValidate>
                        {error && (
                            <div className="alert-error mb-4" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label
                                htmlFor="originalUrl"
                                className="block text-sm font-medium text-text-dark mb-2">
                                Destination URL
                            </label>
                            <input
                                id="originalUrl"
                                name="originalUrl"
                                type="url"
                                value={form.originalUrl}
                                onChange={handleChange}
                                disabled={submitting}
                                autoFocus
                                placeholder="https://example.com/very/long/url"
                                className="w-full px-3 input-base"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-text-dark mb-2">
                                Title{" "}
                                <span className="text-text-muted font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                disabled={submitting}
                                placeholder="My campaign link"
                                className="w-full px-3 input-base"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="customCode"
                                className="block text-sm font-medium text-text-dark mb-2">
                                Custom code{" "}
                                <span className="text-text-muted font-normal">
                                    (optional)
                                </span>
                            </label>
                            <div className="flex items-center input-base px-3">
                                <span className="text-text-muted text-sm shrink-0">
                                    shortn.link/
                                </span>
                                <input
                                    id="customCode"
                                    name="customCode"
                                    type="text"
                                    value={form.customCode}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    placeholder="my-code"
                                    className="flex-1 bg-transparent outline-none text-text-dark text-sm ml-1"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="tags"
                                className="block text-sm font-medium text-text-dark mb-2">
                                Tags{" "}
                                <span className="text-text-muted font-normal">
                                    (comma separated)
                                </span>
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                value={form.tags}
                                onChange={handleChange}
                                disabled={submitting}
                                placeholder="marketing, launch"
                                className="w-full px-3 input-base"
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="expiresAt"
                                className="block text-sm font-medium text-text-dark mb-2">
                                Expires on{" "}
                                <span className="text-text-muted font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                id="expiresAt"
                                name="expiresAt"
                                type="date"
                                value={form.expiresAt}
                                onChange={handleChange}
                                disabled={submitting}
                                className="w-full px-3 input-base"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full"
                            aria-busy={submitting}>
                            {submitting ? "Creating…" : "Create short link"}
                        </button>
                    </form>
                )}
            </div>
        </PageWrapper>
    );
};

export default CreateLink;
