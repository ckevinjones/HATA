import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ component: Component, allowedRoles, userRole, ...rest }) => {
    return allowedRoles.includes(userRole) ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/" /> // Redirect unauthorized users to the login page
    );
};

export default RoleProtectedRoute;
