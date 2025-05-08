import React, { useEffect } from "react";
import Footer from "./Footer"
import Header from "./Header"
import { getProfile } from "../redux/Profile/Slice";
import { useAppDispatch } from "../redux/store";

const Layout = ({children}:{children: React.ReactNode}) => {

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getProfile());
      
    },[dispatch])

    return (
        <div>
            <Header/>
            {children}
            <Footer />
        </div>
    )
}

export default Layout;