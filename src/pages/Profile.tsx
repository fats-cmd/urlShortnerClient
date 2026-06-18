import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import { useAuth } from "../hooks/useAuth";

// ── Profile / account settings (route: "/profile") ───────────────────────────

interface ProfileForm {
    name: string;
    email: string;
    avatarUrl: string;
}

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<ProfileForm>({
        name: user?.name ?? "",
        email: user?.email ?? "",
        avatarUrl: user?.avatarUrl ?? "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    const dirty =
        form.name !== (user?.name ?? "") ||
        form.email !== (user?.email ?? "") ||
        form.avatarUrl !== (user?.avatarUrl ?? "");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSaved(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Enter a valid email.");
            return;
        }

        setSaving(true);
        setError("");
        try {
            await updateUser({
                name: form.name.trim(),
                email: form.email.trim(),
                avatarUrl: form.avatarUrl.trim() || undefined,
            });
            setSaved(true);
        } catch {
            setError("Could not save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <PageWrapper>
            <div className="mx-auto px-4" style={{ maxWidth: 640 }}>
                <h1 className="font-display text-2xl font-bold text-text-dark mb-1">
                    Profile
                </h1>
                <p className="text-text-muted text-sm mb-6">
                    Manage your account details and preferences.
                </p>

                {/* ── Identity card ── */}
                <div className="card p-6 mb-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-sage/30 border border-sage/40 flex items-center justify-center text-2xl font-bold text-forest overflow-hidden shrink-0">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            (user?.name?.charAt(0).toUpperCase() ?? "U")
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-text-dark truncate">
                            {user?.name}
                        </div>
                        <div className="text-sm text-text-muted truncate">
                            {user?.email}
                        </div>
                        <span className="inline-block mt-1.5 text-xs font-semibold uppercase tracking-wide text-fern bg-[rgba(88,129,87,0.1)] px-2 py-0.5 rounded-full">
                            {user?.plan ?? "free"} plan
                        </span>
                    </div>
                </div>

                {/* ── Edit form ── */}
                <form onSubmit={handleSubmit} className="card p-6" noValidate>
                    <h2 className="font-semibold text-text-dark mb-4">
                        Account details
                    </h2>

                    {error && (
                        <div className="alert-error mb-4" role="alert">
                            {error}
                        </div>
                    )}
                    {saved && (
                        <div className="alert-success mb-4" role="status">
                            ✓ Profile updated.
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-text-dark mb-2">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            disabled={saving}
                            className="w-full px-3 input-base"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-text-dark mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={saving}
                            className="w-full px-3 input-base"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="avatarUrl"
                            className="block text-sm font-medium text-text-dark mb-2">
                            Avatar URL{" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </label>
                        <input
                            id="avatarUrl"
                            name="avatarUrl"
                            type="url"
                            value={form.avatarUrl}
                            onChange={handleChange}
                            disabled={saving}
                            placeholder="https://…"
                            className="w-full px-3 input-base"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving || !dirty}
                        className="btn-primary w-full disabled:opacity-50"
                        aria-busy={saving}>
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </form>

                {/* ── Danger zone ── */}
                <div className="card p-6 mt-5">
                    <h2 className="font-semibold text-text-dark mb-1">
                        Sign out
                    </h2>
                    <p className="text-sm text-text-muted mb-4">
                        Sign out of your account on this device.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium px-4 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50">
                        Sign out
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Profile;
