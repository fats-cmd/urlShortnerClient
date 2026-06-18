import { useState } from "react";
import PageWrapper from "../components/shared/PageWrapper";
import { useAuth } from "../hooks/useAuth";
import type { PlanName } from "../types/User";

// ── Subscription / plans (route: "/subscription") ────────────────────────────

interface Plan {
    id: PlanName;
    name: string;
    price: string;
    cadence: string;
    tagline: string;
    features: string[];
    highlight?: boolean;
}

const PLANS: Plan[] = [
    {
        id: "free",
        name: "Starter",
        price: "$0",
        cadence: "forever",
        tagline: "For personal projects and trying things out.",
        features: [
            "Up to 50 links",
            "Basic click analytics",
            "Standard short domain",
            "Community support",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$12",
        cadence: "per month",
        tagline: "For creators and growing teams.",
        features: [
            "Unlimited links",
            "Advanced analytics & exports",
            "Custom codes & tags",
            "Link expiration & scheduling",
            "Priority support",
        ],
        highlight: true,
    },
    {
        id: "business",
        name: "Business",
        price: "$39",
        cadence: "per month",
        tagline: "For organisations that need scale and control.",
        features: [
            "Everything in Pro",
            "Custom branded domain",
            "Team collaboration & roles",
            "API access",
            "Dedicated support",
        ],
    },
];

const Subscription = () => {
    const { user, updateUser } = useAuth();
    const [pending, setPending] = useState<PlanName | null>(null);
    const currentPlan = user?.plan ?? "free";

    const handleSelect = async (plan: PlanName) => {
        if (plan === currentPlan) return;
        setPending(plan);
        try {
            await updateUser({ plan });
        } finally {
            setPending(null);
        }
    };

    return (
        <PageWrapper>
            <div className="mx-auto px-4" style={{ maxWidth: 1000 }}>
                <div className="text-center mb-10">
                    <h1 className="font-display text-3xl font-bold text-text-dark mb-2">
                        Choose your plan
                    </h1>
                    <p className="text-text-muted">
                        Upgrade or downgrade at any time. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {PLANS.map((plan) => {
                        const isCurrent = plan.id === currentPlan;
                        const isPending = pending === plan.id;
                        return (
                            <div
                                key={plan.id}
                                className={`card p-6 relative ${
                                    plan.highlight
                                        ? "border-forest shadow-lg md:-mt-2"
                                        : ""
                                }`}>
                                {plan.highlight && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.7rem] font-semibold uppercase tracking-wide text-linen bg-forest px-3 py-1 rounded-full">
                                        Most popular
                                    </span>
                                )}

                                <h2 className="font-display text-xl font-bold text-text-dark">
                                    {plan.name}
                                </h2>
                                <p className="text-sm text-text-muted mt-1 mb-4 min-h-[40px]">
                                    {plan.tagline}
                                </p>

                                <div className="mb-5">
                                    <span className="font-display text-3xl font-extrabold text-forest">
                                        {plan.price}
                                    </span>
                                    <span className="text-text-muted text-sm ml-1">
                                        {plan.cadence}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleSelect(plan.id)}
                                    disabled={isCurrent || isPending}
                                    className={`w-full mb-6 text-sm font-semibold ${
                                        plan.highlight ? "btn-primary" : "btn-outline"
                                    } disabled:opacity-60`}>
                                    {isCurrent
                                        ? "Current plan"
                                        : isPending
                                          ? "Updating…"
                                          : `Switch to ${plan.name}`}
                                </button>

                                <ul className="flex flex-col gap-2.5">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2 text-sm text-text-body">
                                            <span className="text-fern mt-0.5">
                                                ✓
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-xs text-text-muted mt-8">
                    Plans are managed locally in this demo — selecting one
                    updates your account instantly.
                </p>
            </div>
        </PageWrapper>
    );
};

export default Subscription;
