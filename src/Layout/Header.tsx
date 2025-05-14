import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icons } from "../assets/pngs";
import { toast } from "react-toastify";

const Header = () => {
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const toggleButton = () => {
    setIsButtonOpen(!isButtonOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (
        isButtonOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) 
      ) {
        setIsButtonOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isButtonOpen]);

  const listItem = [
    {
      label: "Bookmark",
      path: "/bookmarkpage",
    },
  ];

  return (
    <div className="sticky top-0 mx-auto flex justify-center bg-gray-100 z-10">
      <div className="max-w-sm w-full bg-white flex flex-row items-center px-4 py-2 relative">
        {/* Left empty div for balance */}
        <div className="w-5"></div>

        {/* Instagram logo centered */}
        <div className="flex-1 flex justify-center">
          <img
            className="w-44 h-7 font-black "
            alt="insta"
            src={Icons.social}
          />
        </div>

        {/* Menu icon at right */}
        <div className="relative">
          <img
            className="w-5 h-5 cursor-pointer"
            onClick={toggleButton}
            alt="hamburger"
            src="https://cdn0.iconfinder.com/data/icons/rounded-basics/24/rounded__menu-512.png"
            ref={buttonRef}
          />
          {isButtonOpen && (
            <div
              ref={menuRef}
              className="absolute right-4 top-8 bg-slate-100 w-30 p-2 rounded-lg shadow-lg flex flex-col space-y-1 z-50"
            >
              {listItem.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col content-center items-start"
                >
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "bg-slate-100 rounded-md px-3 py-1 w-full block"
                        : "bg-slate-100 rounded-md px-3 py-1 w-full block"
                    }
                    to={item.path}
                    onClick={toggleButton}
                  >
                    {item.label}
                  </NavLink>
                </div>
              ))}
              <div>
                <button
                  className="bg-slate-100 hover:bg-slate-300 px-3 py-1 rounded-md w-full text-left block"
                  title="Logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
