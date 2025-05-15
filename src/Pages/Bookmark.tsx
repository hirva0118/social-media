import  { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { getBookmark } from "../redux/Bookmark/Slice";

const Bookmark = () => {
  const book = useAppSelector((state) => state.bookmark.bookmarkData);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBookmark());
  }, []);

  const handleNavigate = (_id:string) => {
    try {
        navigate(`/openpost/${_id}`);
    } catch (error) {
        console.log(error)
    }
    
  }

  return (
    <div className="contain">
      <div className="container">
        <h1 className="text-lg text-center">Bookmarked Post</h1>
        <div className="grid grid-cols-2 gap-2 pt-5">
        {book?.bookmarkedPosts.map((b) => (
          <div >
            <img alt="image" src={b.images[0].url ?? ""} onClick={()=>handleNavigate(b._id)} />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
