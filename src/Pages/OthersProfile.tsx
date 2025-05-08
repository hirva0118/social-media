import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  followerList,
  followingList,
  getOthersProfile,
  getProfile,
  toBeFollowed,
} from "../redux/Profile/Slice";
import { useParams } from "react-router-dom";

const OthersProfile = () => {
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const othersData = useAppSelector((state) => state.profile.othersProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  // const isFollowing = useAppSelector((state) => state.profile.following);

  useEffect(() => {
    (async () => {
      if (username) {
        setIsLoading(true);
        await dispatch(getOthersProfile({ username }));
        setIsLoading(false);
      }
    })();
  }, [dispatch, username]);

  const handleFollow = async (toBeFollowedUserId: string) => {
    try {
      setFollowLoading(true);
      await dispatch(toBeFollowed({ toBeFollowedUserId }));
      if (username) {
        await dispatch(getOthersProfile({ username }));
        await dispatch(followerList({
          username,
          page: 0
        }));
        await dispatch(followingList({
          username,
          page: 0
        }));
      }
      await dispatch(getProfile());
    } catch (error) {
      console.log(error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="contain">
        <div className="container flex justify-center items-center p-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contain">
      <div className="container">
        <div className="flex flex-row gap-5">
          <img
            className="h-16 w-16"
            alt="profile"
            src={
              othersData?.coverImage?.url ||
              "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
            }
            onError={(e) =>
              (e.currentTarget.src =
                "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png")
            }
          />
          <div className="flex flex-row justify-evenly w-[100%] items-center">
            {/* <div className="flex flex-col items-center">
              <p>{postData.totalPosts}</p>
              <p>Posts</p>
            </div> */}
            <div className="flex flex-col items-center">
              <p>{othersData?.followersCount}</p>
              <p>Followers</p>
            </div>
            <div className="flex flex-col items-center">
              <p>{othersData?.followingCount}</p>
              <p>Followings</p>
            </div>
          </div>
        </div>
        <div className="pt-3 pb-4">
          <p className="font-bold">
            {othersData?.firstName} {othersData?.lastName}
          </p>
          <p>{othersData?.bio}</p>
        </div>
        {othersData && (
          <div>
            <button
              onClick={() => handleFollow(othersData.account._id)}
              className="w-full border border-gray-300 rounded-xl p-1 font-semibold relative"
            >
              {followLoading && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {othersData.isFollowing ? "UnFollow" : "Follow"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OthersProfile;
