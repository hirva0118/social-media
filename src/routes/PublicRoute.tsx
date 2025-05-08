import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({children}:{children: React.ReactNode}) => {

    const isAuthenticated = localStorage.getItem("accessToken");
    // console.log(isAuthenticated);

    return <>{isAuthenticated ? <Navigate to="/"/> : <>{children}</>}</>
};

export default PublicRoute
