import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./router/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifySuccess from "./pages/auth/VerifySuccess";
import Home from "./pages/Home";
import LinkDetail from "./pages/LinkDetail";
import CreateLink from "./pages/CreateLink";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Authenticated */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/verify-success" element={<VerifySuccess />} />
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/links/create" element={<CreateLink />} />
                        <Route path="/links/:id" element={<LinkDetail />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/subscription" element={<Subscription />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
