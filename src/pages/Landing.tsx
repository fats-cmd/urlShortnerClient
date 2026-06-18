import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import heroImg from "../assets/hero.png";

// ── Public marketing homepage (route: "/") ───────────────────────────────────

const FEATURES: { icon: string; title: string; body: string }[] = [
    {
        icon: "⚡",
        title: "Instant short links",
        body: "Turn long, messy URLs into clean branded links in one click.",
    },
    {
        icon: "📊",
        title: "Real-time analytics",
        body: "Track clicks, locations, and devices as they happen.",
    },
    {
        icon: "🎯",
        title: "Custom codes",
        body: "Pick your own memorable slug instead of random characters.",
    },
    {
        icon: "⏳",
        title: "Expiration & scheduling",
        body: "Set links to expire automatically when a campaign ends.",
    },
];

const STATS: [string, string][] = [
    ["2.4M+", "Links created"],
    ["99.9%", "Uptime"],
    ["180+", "Countries"],
];

const Landing = () => {
    const { isAuthenticated } = useAuth();
    const primaryHref = isAuthenticated ? "/dashboard" : "/signup";
    const primaryLabel = isAuthenticated ? "Go to dashboard" : "Get started free";

    return (
        <div className="min-h-screen bg-bg-main text-text-body">
            {/* ── Header ── */}
            <header className="sticky top-0 z-50 bg-deep border-b border-forest">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-6">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl">⬡</span>
                        <span className="font-display font-bold text-linen text-lg">
                            Shortn
                        </span>
                    </Link>
                    <nav className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-primary text-sm">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-linen opacity-90 px-3 py-1">
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-md bg-sage text-deep hover:bg-fern">
                                    Get started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
                <div className="fade-in-up">
                    <span className="inline-block text-xs font-semibold tracking-wide uppercase text-fern bg-[rgba(88,129,87,0.1)] px-3 py-1 rounded-full mb-5">
                        Smarter link management
                    </span>
                    <h1 className="font-display font-bold text-text-dark text-4xl lg:text-5xl leading-tight mb-5">
                        Short links,<br />big impact.
                    </h1>
                    <p className="text-text-muted text-lg max-w-md mb-8">
                        Shorten, brand, and track every link from one clean
                        dashboard. Understand your audience and grow with
                        confidence.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link to={primaryHref} className="btn-primary px-5 py-2.5">
                            {primaryLabel}
                        </Link>
                        <Link
                            to="/login"
                            className="btn-outline px-5 py-2.5 text-sm font-semibold">
                            Sign in
                        </Link>
                    </div>

                    <div className="flex gap-8 mt-12">
                        {STATS.map(([value, label]) => (
                            <div key={label}>
                                <div className="font-display text-2xl font-bold text-forest">
                                    {value}
                                </div>
                                <div className="text-xs text-text-muted mt-1">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block fade-in-up">
                    <img
                        src={heroImg}
                        alt="Shortn dashboard preview"
                        className="w-full rounded-2xl shadow-2xl border border-[var(--border-light)]"
                    />
                </div>
            </section>

            {/* ── Features ── */}
            <section className="bg-bg-card border-y border-[var(--border-light)]">
                <div className="max-w-[1200px] mx-auto px-6 py-16">
                    <h2 className="font-display font-bold text-text-dark text-2xl lg:text-3xl text-center mb-3">
                        Everything you need to manage links
                    </h2>
                    <p className="text-text-muted text-center max-w-xl mx-auto mb-12">
                        Powerful features wrapped in a clean, fast interface —
                        built for marketers, developers, and creators.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="card p-6">
                                <div className="text-2xl mb-3">{f.icon}</div>
                                <h3 className="font-semibold text-text-dark mb-1.5">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-20 text-center">
                <h2 className="font-display font-bold text-text-dark text-2xl lg:text-3xl mb-4">
                    Ready to shorten your first link?
                </h2>
                <p className="text-text-muted mb-8">
                    Free forever on the Starter plan. No credit card required.
                </p>
                <Link to={primaryHref} className="btn-primary px-6 py-3 text-base">
                    {primaryLabel}
                </Link>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-deep text-linen">
                <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⬡</span>
                        <span className="font-display font-bold">Shortn</span>
                    </div>
                    <p className="text-sm text-sage">
                        © {new Date().getFullYear()} Shortn. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
