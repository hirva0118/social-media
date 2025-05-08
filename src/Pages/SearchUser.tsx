import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getProfileByUsername } from "../redux/Profile/Slice";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getSearchData = useAppSelector((state) => state.profile.searchData);
  const { userData } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (name) {
      const timeout = setTimeout(
        () => {
          dispatch(getProfileByUsername({ username: name }));
        },
        name ? 500 : 0
      );
      return () => clearTimeout(timeout);
    }
  }, [name, dispatch]);

  const handleOpenPost = (username: string) => {
    try {
      navigate(`/othersprofile/${username}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contain">
      <div className="container">
        <div>
          <input
            className="w-[100%] p-2 border border-gray-300 rounded-lg"
            type="text"
            placeholder=" Search Username..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="pt-5 overflow-y-auto">
          {getSearchData?.map((d) => (
            <div className="flex">
              {d.account[0]._id !== userData?.account._id && (
              <div className="items-center p-2 ">
                <img
                  className="w-8 h-8"
                  alt=""
                  src={
                    d.coverImage?.url ||
                    "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
                  }
                  onError={(e)=>e.currentTarget.src="https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
                />
              </div>
              )}
              {d.account[0]._id !== userData?.account._id && (
                <div
                  key={d._id}
                  className="flex items-center  gap-3 p-2  cursor-pointer "
                  onClick={() => handleOpenPost(d.account[0].username)}
                >
                  <span className="font-medium text-gray-800">
                    {d.account[0].username} 
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
