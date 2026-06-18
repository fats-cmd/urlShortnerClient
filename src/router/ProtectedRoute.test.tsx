import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthContext from '../context/AuthContext';
import type { AuthContextValue } from '../types/Auth';

const Dashboard = () => <div>Dashboard Page</div>;
const LoginPage = () => <div>Login Page</div>;

const renderWithAuth = (
    authValue: Partial<AuthContextValue>,
    initialEntries = ['/dashboard'],
) => {
    return render(
        <AuthContext.Provider value={authValue as AuthContextValue}>
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );
};

test('redirects unauthenticated users to /login', async () => {
    renderWithAuth({ isAuthenticated: false, isLoading: false }, ['/dashboard']);
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
});

test('renders nested route when authenticated', async () => {
    renderWithAuth(
        { isAuthenticated: true, isLoading: false, user: { id: '1' } as AuthContextValue['user'] },
        ['/dashboard'],
    );
    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
});
