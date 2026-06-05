import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const email = searchParams.get("email") || "";
    const verificationToken = searchParams.get("token");

    // Auto-verify if token is present in URL
    useEffect(() => {
        if (verificationToken) {
            verifyEmail();
        }
    }, [verificationToken]);

    const verifyEmail = async () => {
        if (!verificationToken) {
            setError("No verification token provided.");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            await api.post("/auth/verify-email", { token: verificationToken });
            navigate("/verify-success", { replace: true });
        } catch (err: unknown) {
            const axiosError = err as {
                response?: { data?: { message?: string; error?: string } };
            };
            const msg =
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                "Verification failed. Please try again.";
            setError(msg);
        } finally {
            setIsVerifying(false);
        }
    };

    const resendEmail = async () => {
        if (!email) {
            setError("Email address is required.");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            await api.post("/auth/resend-verification", { email });
            setSent(true);
            setTimeout(() => setSent(false), 3000);
        } catch (err: unknown) {
            const axiosError = err as {
                response?: { data?: { message?: string; error?: string } };
            };
            const msg =
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                "Failed to resend verification email.";
            setError(msg);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="hidden lg:flex lg:w-5/12 auth-panel-left">
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="auth-logo-mark">
                        <span style={{ color: "var(--forest)", fontSize: "1.5rem" }}>⬡</span>
                    </div>

                    <p className="auth-tagline">Verify your<br/>email address.</p>
                    <p className="auth-sub">We've sent you a verification email. Check your inbox and click the link to confirm your account.</p>

                    <ul className="auth-feature-list">
                        <li>✓ Keep your account secure</li>
                        <li>✓ Unlock all features</li>
                        <li>✓ Personalized experience</li>
                        <li>✓ Priority support</li>
                    </ul>

                    <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", background: "rgba(218,215,205,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(218,215,205,0.2)", backdropFilter: "blur(4px)" }}>
                        <div style={{ fontSize: "0.9rem", color: "var(--linen)" }}>
                            <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
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

                    <h1 className="auth-form-title">Check your email</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                        We sent a verification link to <strong>{email || "your email"}</strong>
                    </p>

                    {error && <div className="alert-error mb-4" role="alert">{error}</div>}
                    {sent && <div className="alert-success mb-4" role="status">✓ Verification email resent. Check your inbox.</div>}

                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                            Click the link in the email to verify your account. This helps us keep your account secure.
                        </p>
                    </div>

                    {isVerifying ? (
                        <button disabled className="btn-primary w-full">
                            Verifying…
                        </button>
                    ) : verificationToken ? (
                        <button onClick={verifyEmail} className="btn-primary w-full">
                            Verify Email
                        </button>
                    ) : (
                        <button onClick={resendEmail} className="btn-primary w-full">
                            Resend Verification Email
                        </button>
                    )}

                    <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(218,215,205,0.2)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Didn't receive an email?{" "}
                            <button
                                onClick={resendEmail}
                                disabled={isVerifying}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--forest)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                            >
                                Click to resend
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
