
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}:{children:React.ReactNode}) => {

  // const navigate=useNavigate();
  const isAuthenticated = localStorage.getItem("accessToken");
  return <>{!isAuthenticated ? <Navigate to="/login" />: <>{children}</>}</>
 
}

export default ProtectedRoute
