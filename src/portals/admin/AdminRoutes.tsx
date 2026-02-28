import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RolesPermissions from './pages/RolesPermissions';
import Organisations from './pages/Organisations';
import Reports from './pages/Reports';
import NotificationsPage from './pages/NotificationsPage';
import AdminSettings from './pages/AdminSettings';

const AdminRoutes = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="organisations" element={<Organisations />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<AdminSettings />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
    </Routes>
);

export default AdminRoutes;
