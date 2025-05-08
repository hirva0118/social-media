import EditProfile from "../Pages/EditProfile";
import Login from "../Pages/Login";
import Profile from "../Pages/Profile";
import SignUp from "../Pages/SignUp";
import PostPage from "../Pages/PostPage";
import OpenPost from "../Pages/OpenPost";
import Bookmark from "../Pages/Bookmark";
import SearchUser from "../Pages/SearchUser";
import OthersProfile from "../Pages/OthersProfile";
import Home from "../Pages/Home";


export const routes= [

    {
        path:"/",
        component:Home , 
        isProtected:true,
    },
    {
        path:"/login",
        component:Login ,
        isProtected: false,
    },
    {
        path:"/register",
        component: SignUp,
        isProtected: false,
    },
    {
        path:"/profile",
        component:Profile,
        isProtected: true,
    },
    {
        path:"/editprofile",
        component: EditProfile,
        isProtected: true,
    },
    {
        path:"/postpage",
        component: PostPage,
        isProtected :true,
    },
    {
        path: "/openpost/:_id",
        component: OpenPost,
        isProtected: true,
    },
    {
        path:"/bookmarkpage",
        component: Bookmark,
        isProtected:true,
    },
    {
        path : "/searchuser",
        component: SearchUser,
        isProtected:true,
    },
    {
        path : "/othersprofile/:username",
        component: OthersProfile,
        isProtected:true,
    }
]