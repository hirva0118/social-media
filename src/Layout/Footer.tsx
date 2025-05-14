import { useNavigate } from "react-router-dom";
import { Icons } from "../assets/pngs";
import { useAppSelector } from "../redux/store";

const Footer = () => {

  const { userData } = useAppSelector((state) => state.profile);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
    
  };
  const handleHome = () => {
    navigate("/");
  };
  const handlePlus = () => {
    navigate("/postpage");
  };
  const handleSearch = () => {
    navigate("/searchuser");
  }

  return (
    <div className="sticky bottom-0 mx-auto flex items-center justify-center bg-gray-100">
      <div className="max-w-sm w-full bg-white">
        <div className="w-full grid grid-cols-4  items-center">
          <div className="flex justify-center">
            <img
              className="w-14 h-14 p-4 cursor-pointer"
              alt="Home"
              src={Icons.Home1}
              onClick={handleHome}
            />
          </div>

          <div className="flex justify-center">
            <img
              onClick={handleSearch}
              className="p-4 cursor-pointer"
              alt="search"
              src={Icons.search}
            />
          </div>
          <div className="flex justify-center">
            <label>
              <img
                onClick={handlePlus}
                className="p-4 cursor-pointer"
                alt="plus"
                src={Icons.Plus}
              />
            </label>
          </div>
          <div className="flex justify-center">
          <img
              className="h-8 w-8 cursor-pointer border border-slate-300 rounded-full "
              alt="profile image"
              onClick={handleProfile}
              
              src={
                userData?.coverImage?.url||"https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
              }
              onError={(e)=>e.currentTarget.src="https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
