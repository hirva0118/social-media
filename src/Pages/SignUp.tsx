import { FormEvent, useState } from "react";
import { Signup } from "../redux/Auth/Slice";
import { useAppDispatch } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const HandleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await dispatch(Signup({ username, email, password })).unwrap();
      toast.success("Registered Successsfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error);
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif">
          Create Account
        </h1>
        <form onSubmit={HandleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition relative"
          >
            {isLoading && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            Sign Up
          </button>

          <div className="text-right text-xs text-gray-600 pt-2">
            <Link to="/login" className="text-blue-500 hover:underline">
              Already a user?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
