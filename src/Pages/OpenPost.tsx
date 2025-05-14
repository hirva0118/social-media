import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { deletePost, getSinglePostById, likeOnPost } from "../redux/Post/Slice";
import Drawer from "react-modern-drawer";

import {
  addComment,
  deleteComment,
  getComment,
  likeUnlikeComment,
} from "../redux/Comment/Slice";
import { useNavigate, useParams } from "react-router-dom";
import { addRemoveBookmark } from "../redux/Bookmark/Slice";
import CommentComponent from "../Component/Comments";

const OpenPost = () => {
  const [comment, setComment] = useState("");
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<any[]>([]);
  const [isThreeDotOpen, setIsThreeDotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const singlePostdata = useAppSelector((state) => state.post.singlePost);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const [commentLoading, setCommentLoading] = useState(false);

  const cmt = useAppSelector((state) => state.comment.commentdata);
  const { _id: postID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (postID) {
        setIsLoading(true);
        await dispatch(getSinglePostById({ _id: postID }));
        setIsLoading(false);
      }
    })();
  }, [postID, dispatch]);

  const handleLikeDislikePost = async (_id: string) => {
    await dispatch(likeOnPost({ _id }));
    await dispatch(getSinglePostById({ _id }));
  };

  const handleBookmark = async (_id: string) => {
    await dispatch(addRemoveBookmark({ _id }));
    await dispatch(getSinglePostById({ _id }));
  };

  const handleSubmit = async (_id: string, content: string) => {
    try {
      setComment("");
      setCommentLoading(true);
      await dispatch(addComment({ _id, content }));

      const data = await dispatch(getComment({ _id, page: 1 })).unwrap();
      setPage(1);
      setDisplayedComments(data.comments);

      await dispatch(getSinglePostById({ _id }));
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
      setCommentLoading(false);
    } catch (error) {
      console.log(error);
      setNewComments((prev) =>
        prev.filter((c) => c._id !== `temp-${Date.now()}`)
      );
    }
  };

  const handleLikeUnlikeComment = async (_id: string) => {
    await dispatch(likeUnlikeComment({ _id }));

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

  const toggleHandle = async () => {
    setIsOpen((prevstate) => !prevstate);
    setDisplayedComments([]);
    setNewComments([]);
    setPage(1);

    if (postID) {
      const result = await dispatch(getComment({ _id: postID, page: 1 }));
      if (result.payload?.comments) {
        setDisplayedComments([...result.payload.comments]);
      }
    }
  };

  const handleReadMore = async () => {
    if (!cmt?.hasNextPage) return;

    const nextPage = page + 1;
    if (postID) {
      const result = await dispatch(
        getComment({ _id: postID, page: nextPage })
      );

      if (result.payload?.comments) {
        setPage(nextPage);
        setDisplayedComments((prev) => [...prev, ...result.payload.comments]);
      }
    }
  };

  const handleThreeDot = () => {
    setIsThreeDotOpen(!isThreeDotOpen);
  };

  const handleDeletePost = async (_id: string) => {
    try {
      await dispatch(deletePost({ postId: _id }));
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const result = await dispatch(deleteComment({ commentId: id }));
      if (result.meta.requestStatus == "fulfilled") {
        setNewComments((prev) => prev.filter((comment) => comment._id !== id));
        setDisplayedComments((prev) =>
          prev.filter((comment) => comment._id !== id)
        );
      }
      if (postID) {
        await dispatch(getSinglePostById({ _id: postID }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isThreeDotOpen &&
        menuRef.current &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsThreeDotOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThreeDotOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        commentRef.current &&
        !commentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <div className="contain">
      <div className="container flex justify-center items-center p-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading post...</p>
        </div>
      </div>
      </div>
    );
  }
  return (
    <>
      {singlePostdata && (
        <div className="contain ">
          <div className="container relative">
            <div className="flex gap-2 pb-2 justify-between">
              <div className="flex gap-2">
                <img
                  className="w-7 h-7"
                  alt="profile"
                  src={singlePostdata.author.coverImage.url?? "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
                  onError={(e)=>e.currentTarget.src="https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}

                />
                <p className="flex items-center">
                  {singlePostdata.author.firstName}{" "}
                  {singlePostdata.author.lastName}
                </p>
              </div>
              <div ref={drawerRef} onClick={handleDrawerClick}>
                <button className="font-bold" onClick={() => handleThreeDot()}>
                  ⋮
                </button>
                {isThreeDotOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-8 top-8 bg-slate-100 w-34 p-3 rounded-md shadow-lg flex flex-col space-y-1 z-50"
                  >
                    <button
                      onClick={() => handleDeletePost(singlePostdata._id)}
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {singlePostdata?.images.map((post) => (
              <div key={post.url}>
                <img className="w-[100%]" alt="image" src={post.url ?? ""}></img>
              </div>
            ))}

            <div className="flex flex-row justify-between items-baseline pb-3">
              <div className="flex gap-2">
                <div>
                  {singlePostdata.isLiked ? (
                    <div className="flex items-center gap-1 pt-4">
                      <img
                        alt="like"
                        className="w-5 h-5 cursor-pointer"
                        src="https://cdn-icons-png.freepik.com/256/2550/2550361.png?semt=ais_hybrid"
                        onClick={() =>
                          handleLikeDislikePost(singlePostdata._id)
                        }
                      />
                      <span>{singlePostdata.likes}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 pt-4">
                      <img
                        alt="unlike"
                        className="w-5 h-5 cursor-pointer"
                        src="https://static-00.iconduck.com/assets.00/heart-icon-512x441-zviestnn.png"
                        onClick={() =>
                          handleLikeDislikePost(singlePostdata._id)
                        }
                      />
                      <span>{singlePostdata.likes}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center pt-4 ">
                  <img
                    onClick={() => toggleHandle()}
                    className="cursor-pointer w-6 h-6 "
                    alt="comment"
                    src="https://media.istockphoto.com/id/1001787048/vector/comment-icon-vector-icon-simple-element-illustration-comment-symbol-design-can-be-used-for.jpg?s=612x612&w=0&k=20&c=uwvR6JVQZ5a9dE7KQqRv7IBhATWMj94_dc-Ov6cGl0Q="
                  ></img>
                  <span className="pl-1">{singlePostdata.comments}</span>
                </div>
              </div>
              <div>
                {singlePostdata.isBookmarked ? (
                  <div>
                    <img
                      className="w-6 h-6"
                      alt="bookmark"
                      src="https://static.vecteezy.com/system/resources/thumbnails/005/200/965/small/bookmark-black-color-icon-vector.jpg"
                      onClick={() => handleBookmark(singlePostdata._id)}
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      className="w-5 h-5"
                      alt="not bookmarked"
                      src="https://cdn-icons-png.flaticon.com/512/3031/3031121.png"
                      onClick={() => handleBookmark(singlePostdata._id)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 pb-5">
              <p className="font-bold text-start">
                {singlePostdata.author.firstName}{" "}
                {singlePostdata.author.lastName}
              </p>
              <p className="items-center ">
                {singlePostdata.content}
              </p>
            </div>
            <Drawer
              className="overflow-y-auto overflow-x-auto"
              open={isOpen}
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
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                ref={commentRef}
                onClick={handleDrawerClick}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between sticky top-0 bg-slate-200 mb-3 z-10">
                  <p className="m-2 ">Comments :</p>
                  <img
                    className="w-5 h-5 cursor-pointer m-2"
                    alt="close"
                    src="https://icons.veryicon.com/png/o/miscellaneous/medium-thin-linear-icon/cross-23.png"
                    onClick={() => setIsOpen(false)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto" id="commentDrawer">
                  {displayedComments.map((com) => (
                    <CommentComponent
                      profile={com.author?.coverImage?.url}
                      firstname={com.author?.firstName}
                      lastname={com.author?.lastName}
                      content={com.content}
                      isLiked={com.isLiked}
                      likes={com.likes}
                      authorId={com.author.owner}
                      id={com._id}
                      key={com._id}
                      onClick={() => handleLikeUnlikeComment(com._id)}
                      onClickButton={() => handleDeleteComment(com._id)}
                    />
                  ))}

                  {cmt?.hasNextPage && (
                    <div className="text-center my-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 font-medium px-4 py-2"
                        onClick={handleReadMore}
                      >
                        Read more
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-2 sticky bottom-0 bg-slate-200 border-t border-gray-300 mt-auto">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                      type="submit"
                      onClick={() => handleSubmit(singlePostdata._id, comment)}
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
      )}
    </>
  );
};

export default OpenPost;
