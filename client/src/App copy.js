import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';
import AgentPortal from './pages/AgentPortal';
import ClientPortal from './pages/ClientPortal';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { getUserRole } from './utils/supabaseClient';

function App() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        (async () => {
            const role = await getUserRole();
            setUserRole(role);
        })();
    }, []);

    if (userRole === null) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/admin"
                    element={<RoleProtectedRoute component={AdminPortal} allowedRoles={['CompanyAdmin']} userRole={userRole} />}
                />
                <Route
                    path="/agent"
                    element={<RoleProtectedRoute component={AgentPortal} allowedRoles={['Agent']} userRole={userRole} />}
                />
                <Route
                    path="/client"
                    element={<RoleProtectedRoute component={ClientPortal} allowedRoles={['Client']} userRole={userRole} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
