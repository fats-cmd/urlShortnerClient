import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifySuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Auto-redirect to dashboard after 3 seconds
        const timer = setTimeout(() => {
            navigate("/dashboard", { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="auth-page">
            <div className="hidden lg:flex lg:w-5/12 auth-panel-left">
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="auth-logo-mark">
                        <span style={{ color: "var(--forest)", fontSize: "1.5rem" }}>⬡</span>
                    </div>

                    <p className="auth-tagline">You're all<br/>set!</p>
                    <p className="auth-sub">Your account has been verified. Welcome to Shortn — you're ready to start creating and tracking links.</p>

                    <ul className="auth-feature-list">
                        <li>✓ Account verified and active</li>
                        <li>✓ All features unlocked</li>
                        <li>✓ Start shortening links immediately</li>
                        <li>✓ Access real-time analytics</li>
                    </ul>

                    <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", background: "rgba(218,215,205,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(218,215,205,0.2)", backdropFilter: "blur(4px)" }}>
                        <div style={{ fontSize: "0.9rem", color: "var(--linen)" }}>
                            <strong>What's next?</strong> Create your first short link and start tracking performance with Shortn's powerful analytics.
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

                    <h1 className="auth-form-title">Email verified!</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
                        Your account is now fully set up and ready to go.
                    </p>

                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎉</div>
                        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "1rem" }}>
                            Welcome to Shortn!
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            Redirecting you to your dashboard in a moment...
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard", { replace: true })}
                        className="btn-primary w-full"
                    >
                        Go to Dashboard Now
                    </button>

                    <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(218,215,205,0.2)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Ready to get started? Check out our{" "}
                            <span style={{ color: "var(--forest)", fontWeight: 600 }}>quick start guide</span> to create your first link.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifySuccess;
