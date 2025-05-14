import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useEffect, useRef, useState } from "react";
import { getMyPost } from "../redux/Post/Slice";
import Drawer from "react-modern-drawer";
import { followerList, followingList } from "../redux/Profile/Slice";

const Profile = () => {
  const { userData } = useAppSelector((state) => state.profile);
  const { postData } = useAppSelector((state) => state.post);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isFollowOpen, setIsFollowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const followerData = useAppSelector((state) => state.profile.followerList);
  const followingData = useAppSelector((state) => state.profile.followingList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const followerRef = useRef<HTMLDivElement>(null);
  const followingRef = useRef<HTMLDivElement>(null);
  const [pageFollower, setPageFollower] = useState(1);
  const [pageFollowing, setPageFollowing] = useState(1);
  const [localFollowers, setLocalFollowers] = useState<any[]>([]);
  const [localFollowing, setLocalFollowing] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        await dispatch(getMyPost());
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [dispatch]);

  // Update local state when followerData changes
  useEffect(() => {
    if (followerData?.followers) {
      setLocalFollowers(prev => 
        pageFollower === 1 ? [...followerData.followers] : [...prev, ...followerData.followers]
      );
    }
  }, [followerData]);

  // Update local state when followingData changes
  useEffect(() => {
    if (followingData?.following) {
      setLocalFollowing(prev => 
        pageFollowing === 1 ? [...followingData.following] : [...prev, ...followingData.following]
      );
    }
  }, [followingData]);

  const handleEditProfile = () => {
    navigate("/editprofile");
  };

  const handleOpenPost = async (_id: string) => {
    try {
      // await dispatch(getSinglePostById({_id}));
      navigate(`/openpost/${_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowingList = async (username: string) => {
    setIsFollowingOpen((prevstate) => !prevstate);
    setPageFollowing(1);
    setLocalFollowing([]);
    await dispatch(followingList({
      username,
      page: 1
    }));
  };

  const handleFollowerList = async (username: string) => {
    setIsFollowOpen((prev) => !prev);
    setPageFollower(1);
    setLocalFollowers([]);
    await dispatch(followerList({ username, page: 1 }));
  };

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isFollowOpen &&
        followerRef.current &&
        !followerRef.current.contains(event.target as Node)
      ) {
        setIsFollowOpen(false);
      }
      if (
        isFollowingOpen &&
        followingRef.current &&
        !followingRef.current?.contains(event.target as Node)
      ) {
        setIsFollowingOpen(false);
      }
    };
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFollowOpen, isFollowingOpen]);

  const handleFollowNavigation = (username: string | null) => {
    navigate(`/othersprofile/${username}`);
  };

  if (isLoading) {
    return (
      <div className="contain">
        <div className="container flex justify-center items-center p-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleReadMoreFollower = async(username: string) => {
    if(!followerData?.hasNextPage) return;
    const next = pageFollower + 1;
    setPageFollower(next);
    await dispatch(followerList({ username, page: next })).unwrap();
  }
  
  const handleReadMoreFollowing = async(username: string) => {
    if(!followingData?.hasNextPage) return;
    const next = pageFollowing + 1;
    setPageFollowing(next);
    await dispatch(followingList({ username, page: next })).unwrap();
  }

  const handleCancel = () => {
    setIsFollowOpen(false);
    setIsFollowingOpen(false);
  }

  return (
    <div className="contain">
      <div className=" container">
        <div className="flex flex-row gap-4">
          <img
            className="h-16 w-16 border border-slate-300 rounded-full p-1"
            alt="profile image"
            src={
              userData?.coverImage?.url ||
              "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
            }
            onError={(e) =>
              (e.currentTarget.src =
                "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png")
            }
          />

          <div className="flex flex-row justify-between gap-2 w-[100%] items-center">
            <div className="flex flex-col items-center">
              <p className="font-semibold">{postData?.totalPosts}</p>
              <p>Posts</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <p
                className="font-semibold"
                onClick={() =>
                  handleFollowerList(userData?.account?.username || "no")
                }
              >
                {userData?.followersCount}
              </p>
              <p>Followers</p>
              <Drawer
                open={isFollowOpen}
                direction="bottom"
                style={{
                  position: "fixed",
                  maxWidth: "350px",
                  left: "0",
                  right: "0",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxHeight: "80vh",
                  bottom: "0",
                }}
              >
                <div ref={followerRef} onClick={handleDrawerClick}>
                  <div className="flex justify-between sticky top-0 bg-slate-200 mb-3 z-10">
                    <p className="m-2 ">Follower's List: </p>
                    <img
                      className="w-5 h-5 cursor-pointer m-2"
                      alt="close"
                      src="https://icons.veryicon.com/png/o/miscellaneous/medium-thin-linear-icon/cross-23.png"
                      onClick={() => handleCancel()}
                    />
                  </div>
                  <ul>
                    {localFollowers.map((following, index) => (
                      <div className="flex gap-3 p-2" key={`follower-${following.username}-${index}`}>
                        <img
                          className="w-7 h-7"
                          alt="profile"
                          src={following.profile.coverImage.url}
                          onError={(e)=>e.currentTarget.src="https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
                        />
                        <p
                          className="cursor-pointer"
                          onClick={() =>
                            handleFollowNavigation(following.username)
                          }
                        >
                          {following.profile.firstName}{" "}
                          {following.profile.lastName}
                        </p>
                      </div>
                    ))}
                    {followerData?.hasNextPage && (
                      <div className="text-center my-3">
                        <button
                          className="text-blue-500 hover:text-blue-700 font-medium px-4 py-2"
                          onClick={(e)=>{e.stopPropagation();handleReadMoreFollower(userData?.account.username?? "")}}
                        >
                          Read more
                        </button>
                      </div>
                    )}
                  </ul>
                </div>
              </Drawer>
            </div>

            <div className="flex flex-col items-center cursor-pointer">
              <p
                className="font-semibold"
                onClick={() =>
                  handleFollowingList(userData?.account.username || "No")
                }
              >
                {userData?.followingCount}
              </p>
              <p>Followings</p>
              <Drawer
                className="overflow-y-auto" 
                open={isFollowingOpen}
                direction="bottom"
                style={{
                  position: "fixed",
                  maxWidth: "350px",
                  left: "0",
                  right: "0",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxHeight: "80vh",
                  bottom: "0",
                }}
              >
                <div ref={followingRef} onClick={handleDrawerClick}>
                  <div className="flex justify-between sticky top-0 bg-slate-200 mb-3 z-10">
                    <p className="m-2 ">Following's List :</p>
                    <img
                      className="w-5 h-5 cursor-pointer m-2"
                      alt="close"
                      src="https://icons.veryicon.com/png/o/miscellaneous/medium-thin-linear-icon/cross-23.png"
                      onClick={() => handleCancel()}
                    />
                  </div>
                  <ul>
                    {localFollowing.map((follow, index) => (
                      <div className="flex gap-3 p-2" key={`following-${follow.username}-${index}`}>
                        <img
                          className="w-7 h-7"
                          alt="profile"
                          src={follow.profile.coverImage.url}
                          onError={(e)=>e.currentTarget.src="https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
                        />
                        <p
                          className="cursor-pointer"
                          onClick={() =>
                            handleFollowNavigation(follow.username)
                          }
                        >
                          {follow.profile.firstName} {follow.profile.lastName}
                        </p>
                      </div>
                    ))}
                    {followingData?.hasNextPage && (
                      <div className="text-center my-3">
                        <button
                          className="text-blue-500 hover:text-blue-700 font-medium px-4 py-2"
                          onClick={(e)=>{e.stopPropagation();handleReadMoreFollowing(userData?.account.username?? "")}}
                        >
                          Read more
                        </button>
                      </div>
                    )}
                  </ul>
                </div>
              </Drawer>
            </div>
          </div>
        </div>
        <div className="pt-3 pb-4">
          <p className="font-semibold">
            {userData?.firstName} {userData?.lastName}
          </p>
          <p>{userData?.bio}</p>
        </div>

        <button
          onClick={handleEditProfile}
          className=" p-1 w-full  border border-gray-200 rounded-lg font-semibold text-sm"
        >
          Edit Profile
        </button>
        <div className="grid grid-cols-3 gap-1 mt-6 ">
          {postData.posts
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((post) => {
              return (
                <div key={post._id}>
                  <img
                    className="w-full h-full cursor-pointer"
                    alt="image"
                    src={post.images[0]?.url ?? ""}
                    onClick={() => handleOpenPost(post._id)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Profile;