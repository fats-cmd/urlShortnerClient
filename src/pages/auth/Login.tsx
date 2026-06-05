import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { type LoginForm } from "../../types/Auth";
import { EyeIcon } from "../../components/EyeIcon";

// ── Types ──────────────────────────────────────────────────────────────────

// ── Component ──────────────────────────────────────────────────────────────

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();

    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shouldNavigate, setShouldNavigate] = useState(false);

    // Navigate after user state is set
    useEffect(() => {
        if (shouldNavigate && user) {
            navigate(from, { replace: true });
        }
    }, [shouldNavigate, user, navigate, from]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log("[Login] Attempting login with email:", form.email);
            const result = await login(form);
            console.log("[Login] Login successful, user:", result.user);
            // Set flag to trigger navigation once user state updates
            setShouldNavigate(true);
        } catch (err: unknown) {
            console.error("[Login] Error occurred:", err);
            const axiosError = err as {
                response?: { data?: { message?: string; error?: string } };
                message?: string;
            };
            const msg = axiosError.response?.data?.message || 
                       axiosError.response?.data?.error || 
                       axiosError.message ||
                       "Login failed. Check your credentials.";
            console.error("[Login] Error message:", msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="hidden lg:flex lg:w-5/12 auth-panel-left">
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="auth-logo-mark">
                        <span style={{ color: "var(--forest)", fontSize: "1.5rem" }}>⬡</span>
                    </div>

                    <p className="auth-tagline">Short links,<br/>big impact.</p>
                    <p className="auth-sub">Track clicks, manage links, and understand your audience — all from one clean dashboard.</p>

                    <ul className="auth-feature-list">
                        <li>Custom short URLs with your brand</li>
                        <li>Real-time click analytics</li>
                        <li>Link expiration &amp; scheduling</li>
                        <li>Team collaboration tools</li>
                    </ul>

                    <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", background: "rgba(218,215,205,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(218,215,205,0.2)", backdropFilter: "blur(4px)" }}>
                        <div style={{ display: "flex", gap: "2rem" }}>
                            {([
                                ["2.4M+", "Links Created"],
                                ["99.9%", "Uptime"],
                                ["180+", "Countries"],
                            ] as [string, string][]).map(([val, label]) => (
                                <div key={label}>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--linen)" }}>{val}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--sage)", marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-panel-right w-full lg:w-7/12">
                <div className="auth-form-card fade-in-up">
                    <div className="flex lg:hidden items-center gap-2 mb-4">
                        <span className="text-xl">⬡</span>
                        <span className="font-display font-bold text-[var(--deep)] text-lg">Shortn</span>
                    </div>

                    <h1 className="auth-form-title">Welcome back</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>Sign in to your account to continue</p>

                    {error && <div className="alert-error mb-3" role="alert">{error}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-dark)] mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" />
                                    </svg>
                                </div>
                                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required disabled={loading}
                                    className="w-full pl-10 pr-3 input-base" placeholder="you@example.com" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-dark)] mb-2">Password</label>
                                <Link to="/forgot-password" className="text-sm text-[var(--fern)] font-medium">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                        <path d="M8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3zM3 7V5a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1z" />
                                    </svg>
                                </div>
                                <input id="password" name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} autoComplete="current-password" required disabled={loading}
                                    className="w-full pl-10 pr-10 input-base" placeholder="Password" />
                                <button type="button" onClick={() => setShowPwd(p => !p)} tabIndex={-1} aria-label={showPwd ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <EyeIcon open={showPwd} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 mb-4">
                            <input id="remember" type="checkbox" className="w-4 h-4" style={{ accentColor: 'var(--forest)' }} />
                            <label htmlFor="remember" className="text-sm text-[var(--text-muted)]">Keep me signed in</label>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full" aria-busy={loading}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <p className="text-center mb-0 text-sm text-[var(--text-muted)]">Don't have an account? <Link to="/signup" className="text-[var(--forest)] font-semibold">Create one free</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;