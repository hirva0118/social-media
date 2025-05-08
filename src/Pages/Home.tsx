import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getAllPost, likeOnPost } from "../redux/Post/Slice";
import { useNavigate } from "react-router-dom";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  addComment,
  deleteComment,
  getComment,
  likeUnlikeComment,
} from "../redux/Comment/Slice";
import CommentComponent from "../Component/Comments";
import ReadMore from "../Component/ReadMore";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [comm, setComm] = useState("");
  const [page, setPage] = useState(1);
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<any[]>([]); // Store newly added comments separately
  const [allPosts, setAllPosts] = useState<any[]>([]); // Store all loaded posts
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false)
  const [postPage, setPostPage] = useState(1);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { postData } = useAppSelector((state) => state.post);
  const comment = useAppSelector((state) => state.comment.commentdata);
  const userdata = useAppSelector((state) => state.profile.userData);
  const observer = useRef<HTMLDivElement | null>(null);

  // Load initial posts
  useEffect(() => {
    try {
      dispatch(getAllPost({ page: 1 })).then((result) => {
        if (result.payload?.posts) {
          setAllPosts(result.payload.posts);
        }
      });
      
    } catch (error) {
      console.log(error);
    } 
  }, [dispatch]);

  // Handle outside click to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        handleCancel();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && postData.hasNextPage) {
        loadMorePost();
      }
    };
    const newObserver = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    if (observer.current) {
      newObserver.observe(observer.current);
    }
    return () => {
      if (observer.current) newObserver.unobserve(observer.current);
      newObserver.disconnect();
    };
  }, [postData.hasNextPage, postPage]);

  const loadMorePost = async () => {
    try {
      const nextPage = postPage + 1;
      setLoading(true);
      const result = await dispatch(getAllPost({ page: nextPage }));

      if (result.payload?.posts?.length) {
        // Append new posts to existing posts
        setAllPosts((prev) => [...prev, ...result.payload.posts]);
        setPostPage(nextPage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error loading more posts:", error);
    }
  };

  const handleLikeDislikePost = async (_id: string) => {
    await dispatch(likeOnPost({ _id }));

    // Update the like status in our local state
    setAllPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === _id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleNavigate = (username: string | null) => {
    if (userdata?.account.username !== username) {
      try {
        navigate(`/othersprofile/${username}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const handleLikeUnlikeComment = async (_id: string) => {
    await dispatch(likeUnlikeComment({ _id }));

    // Update like status for comments in both arrays
    setNewComments(
      newComments.map((cmt) =>
        cmt._id === _id
          ? {
              ...cmt,
              isLiked: !cmt.isLiked,
              likes: cmt.isLiked ? cmt.likes - 1 : cmt.likes + 1,
            }
          : cmt
      )
    );

    setDisplayedComments(
      displayedComments.map((cmt) =>
        cmt._id === _id
          ? {
              ...cmt,
              isLiked: !cmt.isLiked,
              likes: cmt.isLiked ? cmt.likes - 1 : cmt.likes + 1,
            }
          : cmt
      )
    );
  };

  const toggleHandle = async (_id: string) => {
    // If drawer is already open and we're viewing the same post, close it
    if (isOpen && activeId === _id) {
      handleCancel();
      return;
    }

    // Reset states for new comments
    setDisplayedComments([]);
    setNewComments([]);
    setPage(1);
    setActiveId(_id);
    setLoading(true);

    // Fetch initial comments (page 1)
    const result = await dispatch(getComment({ _id, page: 1 }));

    // Open the drawer
    setIsOpen(true);

    // Set the comments
    if (result.payload?.comments) {
      setDisplayedComments([...result.payload.comments]);
    }

    setLoading(false);
  };

  const handleReadMore = async () => {
    if (loading || !comment?.hasNextPage || !activeId) return;

    setLoading(true);

    // Load next page
    const nextPage = page + 1;
    const result = await dispatch(
      getComment({ _id: activeId, page: nextPage })
    );

    // If successful, update page and append comments
    if (result.payload?.comments) {
      setPage(nextPage);
      setDisplayedComments((prev) => [...prev, ...result.payload.comments]);
    }
    setLoading(false);
  };

  const handleSubmit = async (_id: string, content: string) => {
    if (!content.trim()) return;

    try {
      setCommentLoading(true);

      // Create a temporary comment object that will be displayed immediately
      // const tempComment = {
      //   _id: `temp-${Date.now()}`, // Temporary ID
      //   content: content,
      //   author: {
      //     firstName: userdata?.firstName || "You",
      //     coverImage: { url: userdata?.coverImage?.url || "" },
      //   },
      //   isLiked: false,
      //   likes: 0,
      //   createdAt: new Date().toISOString(),
      //   // Add any other required fields
      // };

      // Add the new comment to the top immediately (optimistic update)
      // setNewComments((prev) => [tempComment, ...prev]);
      setComm("");

      // Actually submit the comment to the API
      await dispatch(addComment({ _id, content })).unwrap();

      // If the API returns the new comment, replace our temporary one with the real one
      // if (addResult.payload?.comment) {
      //   setNewComments((prev) => [
      //     addResult.payload.comment,
      //     ...prev.filter((c) => c._id !== tempComment._id),
      //   ]);
      // }

      const data = await dispatch(
        getComment({ _id: activeId, page: 1 })
      ).unwrap();
      setPage(1);
      setDisplayedComments(data.comments);

      // Update the comment count in the post
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === _id
            ? {
                ...post,
                comments: post.comments + 1,
              }
            : post
        )
      );

      setCommentLoading(false);

      const element = document.getElementById("commentDrawer");
      // if (element) {
      //   element.scrollIntoView({
      //     behavior: "smooth",
      //     block: "start",
      //   });
      // }
      if (element) {
        element.scrollTop = 0;
      }
    } catch (error) {
      console.log(error);
      // Remove the temporary comment if there was an error
      setNewComments((prev) =>
        prev.filter((c) => c._id !== `temp-${Date.now()}`)
      );
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setDisplayedComments([]);
    setNewComments([]);
    setPage(1);
  };

  // Combine new comments at the top with fetched comments
  // const allComments = [ ...displayedComments];

  // Prevent event propagation for clicks inside the drawer
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteComment = async (ID: string, postId: string) => {
    try {
      const result = await dispatch(deleteComment({ commentId: ID }));

      if (result.meta.requestStatus === "fulfilled") {
        // Update the comment count in the post (decrease by 1)
        setAllPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: Math.max(0, post.comments - 1), // Ensure it doesn't go below 0
                }
              : post
          )
        );

        // Remove the deleted comment from both arrays
        setNewComments((prev) => prev.filter((comment) => comment._id !== ID));
        setDisplayedComments((prev) =>
          prev.filter((comment) => comment._id !== ID)
        );

        // Refresh comments for the post
        await dispatch(getComment({ _id: postId, page }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contain">
      <div className="container relative">
        <div className="flex flex-col">
          {allPosts.map((post) => (
            <div key={post._id}>
              <div className="flex flex-row gap-3 items-center">
                <img
                  className="w-8 h-8"
                  alt="profile"
                  src={
                    post.author.coverImage.url ||
                    "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
                  }
                  onError={(e)=>e.currentTarget.src="https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
                />
                <button
                  className="font-semibold"
                  onClick={() => handleNavigate(post.author.account.username)}
                >
                  {post.author.firstName} {post.author.lastName}
                </button>
              </div>
              {post.images && post.images.length > 0 && (
                <img
                  key={post.images[0]._id}
                  className="w-full h-full pt-2 "
                  alt="image"
                  src={post.images[0]?.url}
                />
              )}
              <div className="flex flex-row items-center">
                <div>
                  {post.isLiked ? (
                    <div className="flex flex-row gap-1 my-2 mr-2 items-center">
                      <img
                        alt="like"
                        className="w-5 h-5 cursor-pointer"
                        src="https://cdn-icons-png.freepik.com/256/2550/2550361.png?semt=ais_hybrid"
                        onClick={() => handleLikeDislikePost(post._id)}
                      />
                      <span>{post.likes}</span>
                    </div>
                  ) : (
                    <div className="flex flex-row gap-2 m-2 items-center">
                      <img
                        alt="unlike"
                        className="w-5 h-5 cursor-pointer"
                        src="https://static-00.iconduck.com/assets.00/heart-icon-512x441-zviestnn.png"
                        onClick={() => handleLikeDislikePost(post._id)}
                      />
                      <span>{post.likes}</span>
                    </div>
                  )}
                </div>
                <div>
                  <img
                    onClick={() => toggleHandle(post._id)}
                    className="cursor-pointer w-6 h-6"
                    alt="comment"
                    src="https://media.istockphoto.com/id/1001787048/vector/comment-icon-vector-icon-simple-element-illustration-comment-symbol-design-can-be-used-for.jpg?s=612x612&w=0&k=20&c=uwvR6JVQZ5a9dE7KQqRv7IBhATWMj94_dc-Ov6cGl0Q="
                  />
                </div>
                <span className="pl-1">{post.comments}</span>
              </div>
              <div className="flex flex-col  pb-5">
                <p className="font-bold text-start text-sm">
                  {post.author.firstName} {post.author.lastName}{" "}
                </p>
                  <ReadMore text={post.content} maxLength={70}/>
                {/* <p className="items-center max-w-[60%] ">
                  </p> */}
              </div>
            </div>
          ))}

          {/* Observer element for infinite scroll */}
          {postData.hasNextPage && (
            <div ref={observer} className="h-10 w-full">
              {loading && <p className="text-center">Loading more posts...</p>}
            </div>
          )}

          <Drawer
            className="overflow-y-auto"
            open={isOpen}
            direction="bottom"
            style={{
              position: "fixed",
              maxWidth: "350px",
              left: "0",
              right: "0",
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              maxHeight: "80vh",
              bottom: "0",
              display: "flex",
              flexDirection: "column",
            }}
            onClose={handleCancel}
            enableOverlay={true}
          >
            <div
              className="flex flex-col h-full"
              ref={drawerRef}
              onClick={handleDrawerClick}
            >
              <div className="flex justify-between sticky top-0 bg-slate-200 mb-3 z-10">
                <p className="m-2">Comments :</p>
                <img
                  className="w-5 h-5 cursor-pointer m-2"
                  alt="close"
                  src="https://icons.veryicon.com/png/o/miscellaneous/medium-thin-linear-icon/cross-23.png"
                  onClick={() => handleCancel()}
                />
              </div>

              <div className="flex-1 overflow-y-auto" id="commentDrawer">
                {displayedComments.length > 0 ? (
                  displayedComments.map((cmt) => (
                    <CommentComponent
                      key={cmt._id}
                      profile={cmt.author.coverImage.url}
                      firstname={cmt.author.firstName}
                      lastname={cmt.author.lastName}
                      content={cmt.content}
                      isLiked={cmt.isLiked}
                      likes={cmt.likes}
                      authorId={cmt.author.owner}
                      id={cmt._id}
                      onClick={() => handleLikeUnlikeComment(cmt._id)}
                      onClickButton={() =>
                        handleDeleteComment(cmt._id, activeId)
                      }
                    />
                  ))
                ) : loading ? (
                  <p className="text-center text-gray-500 my-16">
                    Loading comments...
                  </p>
                ) : (
                  <p className="text-center text-gray-500 my-16">
                    No comments yet
                  </p>
                )}

                {comment?.hasNextPage && displayedComments.length > 0 && (
                  <div className="text-center my-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 font-medium px-4 py-2"
                      onClick={handleReadMore}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Read More"}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-2 sticky bottom-0 bg-slate-200 border-t border-gray-300 mt-auto">
                <div className="flex items-center gap-2">
                  <input
                    className="w-[70%] flex-1 px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    type="text"
                    placeholder="Add a comment..."
                    value={comm}
                    onChange={(e) => setComm(e.target.value)}
                  />
                  <button
                    className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition relative"
                    type="submit"
                    disabled={!comm.trim() || commentLoading}
                    onClick={() => activeId && handleSubmit(activeId, comm)}
                  >
                    {commentLoading ? (
                      <>
                        <div className="w-4 h-4 m-1 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>                       
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Home;
