import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./router/ProtectedRoute";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifySuccess from "./pages/auth/VerifySuccess";
import Home from "./pages/Home";

// Placeholders — replaced in subsequent batches
const LinkDetail = () => (
    <div style={{ padding: "2rem", fontFamily: "var(--font-body)" }}>
        🔗 Link Detail — Batch 3
    </div>
);
const CreateLink = () => (
    <div style={{ padding: "2rem", fontFamily: "var(--font-body)" }}>
        ✏️ Create Link — Batch 4
    </div>
);
const Profile = () => (
    <div style={{ padding: "2rem", fontFamily: "var(--font-body)" }}>
        👤 Profile — Batch 5
    </div>
);
const Subscription = () => (
    <div style={{ padding: "2rem", fontFamily: "var(--font-body)" }}>
        💳 Subscription — Batch 6
    </div>
);

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/verify-success" element={<VerifySuccess />} />
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/links/create" element={<CreateLink />} />
                        <Route path="/links/:id" element={<LinkDetail />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/subscription"
                            element={<Subscription />}
                        />
                    </Route>

                    <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
