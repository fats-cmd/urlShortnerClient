import { useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
    type StrengthLevel,
    STRENGTH_COLORS,
    STRENGTH_LABELS,
    STRENGTH_LEVELS,
} from "../../utils/constants/constants";
import { getStrength } from "../../utils/utils";
import { type SignupForm, type SignupCredentials } from "../../types/Auth";
import { EyeIcon } from "../../components/EyeIcon";
import { validateSignupForm } from "../../utils/utils";

const Signup = () => {
    const navigate = useNavigate();
    const { signup, user } = useAuth();

    const [form, setForm] = useState<SignupForm>({
        username: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [emailForVerification, setEmailForVerification] = useState("");

    // Navigate to verification page after signup succeeds
    useEffect(() => {
        if (shouldNavigate && user) {
            navigate(`/verify-email?email=${encodeURIComponent(emailForVerification)}`, { replace: true });
        }
    }, [shouldNavigate, user, navigate, emailForVerification]);
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreed, setAgreed] = useState(false);

    const strength = useMemo(() => getStrength(form.password), [form.password]);
    const passwordsMatch = Boolean(
        form.confirm && form.password === form.confirm,
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    validateSignupForm(form);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationError = validateSignupForm(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            await signup({
                username: form.username,
                email: form.email,
                password: form.password,
                confirm: form.confirm,
                role: "user",
            } as SignupCredentials);
            setEmailForVerification(form.email);
            setShouldNavigate(true);
        } catch (err: unknown) {
            const axiosError = err as {
                response?: { data?: { message?: string; error?: string } };
            };
            const msg =
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                "Registration failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="hidden lg:flex lg:w-5/12 auth-panel-left">
                <div className="relative z-10 px-8">
                    <div className="auth-logo-mark"><span className="text-[var(--forest)] text-lg">⬡</span></div>
                    <p className="auth-tagline">Start<br/>shortening<br/>for free.</p>
                    <p className="auth-sub">Join thousands of marketers, developers, and creators who trust Shortn for smarter link management.</p>

                    <div className="mt-10">
                        {([
                            ['01', 'Create your free account'],
                            ['02', 'Shorten your first link'],
                            ['03', 'Track performance live'],
                        ] as [string,string][]).map(([num, text]) => (
                            <div key={num} className="flex items-center gap-4 mb-4">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold text-[var(--sage)]" style={{ background: 'rgba(163,177,138,0.25)', border: '1px solid rgba(163,177,138,0.4)' }}>{num}</div>
                                <span className="text-[var(--linen)] text-sm opacity-90">{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-[rgba(218,215,205,0.08)] rounded-md border" style={{ borderColor: 'rgba(218,215,205,0.15)' }}>
                        <p className="text-[var(--sage)] text-sm italic">"Shortn helped us cut our marketing link chaos in half. The analytics alone are worth it."</p>
                        <p className="text-[var(--linen)] text-xs mt-2 opacity-70">— Chidera O., Growth Lead</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-7/12 auth-panel-right">
                <div className="auth-form-card fade-in-up max-w-[480px] mx-auto">
                    <div className="flex lg:hidden items-center gap-2 mb-4">
                        <span className="text-xl">⬡</span>
                        <span className="font-display font-bold text-[var(--deep)] text-lg">Shortn</span>
                    </div>

                    <h1 className="auth-form-title">Create your account</h1>
                    <p className="text-[var(--text-muted)] text-sm mb-6">Free forever on the Starter plan</p>

                    {error && <div className="alert-error mb-3">{error}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-[var(--text-dark)] mb-2">Full name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                    {/* person icon */}
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 14s1-4 6-4 6 4 6 4H2z" />
                                    </svg>
                                </div>
                                <input id="username" name="username" type="text" value={form.username} onChange={handleChange} autoComplete="name" required disabled={loading}
                                    className="w-full pl-10 pr-3 input-base" placeholder="Full Name" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-dark)] mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" />
                                    </svg>
                                </div>
                                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required disabled={loading}
                                    className="w-full pl-10 pr-3 input-base" placeholder="Email Address" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-dark)] mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                        <path d="M8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3zM3 7V5a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1z" />
                                    </svg>
                                </div>
                                <input id="password" name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} autoComplete="new-password" required disabled={loading}
                                    className="w-full pl-10 pr-10 input-base" placeholder="At least 8 characters" />
                                <button type="button" onClick={() => setShowPwd(p => !p)} tabIndex={-1} aria-label={showPwd ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <EyeIcon open={showPwd} />
                                </button>
                            </div>

                            {form.password && (
                                <div>
                                    <div className="strength-meter mt-2 flex gap-1">
                                        {([1,2,3,4] as StrengthLevel[]).map(i => (
                                            <div key={i} className={`strength-bar ${i <= strength ? `active-${STRENGTH_LEVELS[strength]}` : ''}`} />
                                        ))}
                                    </div>
                                    <p className="text-[0.75rem] mt-1 mb-0" style={{ color: STRENGTH_COLORS[strength], fontWeight: 500 }}>{STRENGTH_LABELS[strength]}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirm" className="block text-sm font-medium text-[var(--text-dark)] mb-2">Confirm password</label>
                            <div className="relative">
                                <input id="confirm" name="confirm" type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={handleChange} autoComplete="new-password" required disabled={loading}
                                    className="w-full pr-10 input-base" style={{ paddingLeft: '12px' }} placeholder="Re-enter password" />
                                <button type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1} aria-label={showConfirm ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>
                            {form.confirm && !passwordsMatch && <div className="text-[0.75rem] text-red-600 mt-1">Passwords don't match</div>}
                        </div>

                        <div className="flex items-start gap-2 mb-4">
                            <input id="terms" type="checkbox" checked={agreed} onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)} style={{ accentColor: 'var(--forest)' }} className="w-4 h-4 mt-1" />
                            <label htmlFor="terms" className="text-[0.8rem] text-[var(--text-muted)]">I agree to the <a href="#" className="text-[var(--fern)] font-medium">Terms of Service</a> and <a href="#" className="text-[var(--fern)] font-medium">Privacy Policy</a></label>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full" aria-busy={loading}>
                            {loading ? 'Creating account…' : 'Create free account'}
                        </button>
                    </form>

                    <div className="auth-divider mt-4">already have an account?</div>

                    <Link to="/login" className="block w-full text-center mt-3 py-2 btn-outline">Sign in instead</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup
