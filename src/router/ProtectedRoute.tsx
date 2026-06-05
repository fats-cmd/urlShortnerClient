import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                <div className="text-center">
                    <div className="small-spinner mx-auto" aria-hidden />
                    <p className="mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verifying session…</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated — render nested routes
    return <Outlet />;
};

export default ProtectedRoute;
