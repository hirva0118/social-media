import { useAppSelector } from "../redux/store";

interface commentDataProps {
  firstname: string;
  lastname:string;
  content: string;
  isLiked: boolean;
  likes: number;
  id: string;
  authorId: string;
  profile: string;
  onClick: React.MouseEventHandler<HTMLImageElement>;
  onClickButton: React.MouseEventHandler<HTMLButtonElement>;
}

const CommentComponent: React.FC<commentDataProps> = ({
  firstname,
  lastname,
  profile,
  content,
  isLiked,
  id,
  likes,
  authorId,
  onClick,
  onClickButton,
}) => {
  const { userData } = useAppSelector((state) => state.profile);

  return (
    <div>
      <>
        <div className="flex flex-row gap-2">
          <div className="ml-2 w-6 h-6 items-end">
            <img
              alt="p"
              src={profile || "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png")
              }
            />
          </div>
          <div className="flex flex-col">
            <div>
              <p className=" font-semibold text-sm">{firstname} {" "} {lastname}</p>
              <p className="overflow-x-hidden break-words max-w-64 text-sm">
                {content}
              </p>
            </div>

            <div className="content-center flex pb-4 gap-4">
              <div>
                {isLiked ? (
                  <div className="flex flex-row gap-2 content-center items-center">
                    <img
                      key={id}
                      className="w-3 h-3 cursor-pointer "
                      alt="like"
                      src="https://cdn-icons-png.freepik.com/256/2550/2550361.png?semt=ais_hybrid"
                      onClick={onClick}
                    />
                    <p className="text-xs">{likes}</p>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 content-center items-center">
                    <img
                      key={id}
                      className="w-3 h-3 cursor-pointer "
                      alt="unlike"
                      src="https://static-00.iconduck.com/assets.00/heart-icon-512x441-zviestnn.png"
                      onClick={onClick}
                    />
                    <p className="text-xs">{likes}</p>
                  </div>
                )}
              </div>
              <div>
                {userData?.account._id == authorId && (
                  <button
                    className="text-xs text-red-500 flex flex-row content-center items-center"
                    onClick={onClickButton}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default CommentComponent;
