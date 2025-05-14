import { useState } from "react";
import Cropper from "react-easy-crop";
import { useAppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { createPost } from "../redux/Post/Slice";
import { toast } from "react-toastify";

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PostPage = () => {
  const [postImage, setPostImage] = useState<File |null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [caption, setcaption] = useState("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = (e:any) => {
    const file = e.target.files[0];
    setPostImage(file);
    setImageSrc(URL.createObjectURL(file));
  };

  const onComplete = ( croppedAreaPixels:CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!postImage || !croppedAreaPixels) return null;
    const image = await createImageBitmap(postImage);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handlesave = async () => {
    if (!postImage || !croppedAreaPixels) return;
    try {
      setIsLoading(true);
      const croppedImageBlob = await getCroppedImg();
      if (!croppedImageBlob) return;

      const formData = new FormData();
      formData.append("image", croppedImageBlob, "cropped-image.jpg");
      formData.append("content", caption);

      dispatch(createPost(formData as any) ).then((response: any) => {
        if (response.payload.content) {
          toast.success("Post created successfully");
          navigate("/profile");
        } else if (response?.payload?.status === 413) {
          toast.error("File size too large");
        } else if (response?.payload?.status === 422) {
          toast.error("Caption is required");
        } else {
          console.error("Upload failed:", response.payload.error);
          toast.error("File size too large");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setPostImage(null);
    setImageSrc("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  return (
    <div className="contain">
      <div className="container">
        <h1 className="text-xl text-center pb-3">Create a post</h1>
        <label className="cursor-pointer p-2 border border-gray-300 rounded-lg flex justify-center mb-4 text-sm text-gray-600">
          <input
            onChange={handleClick}
            className="hidden"
            title="choose"
            type="file"
            accept="image/*"
          />
          📷 Click to Post
        </label>

        {postImage && (
          <div className="flex flex-col ">
            <div>
              <Cropper
                classes={{
                  containerClassName: "max-w-sm mx-auto h-[260px] mt-[140px] ",
                }}
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onComplete}
                cropSize={{ height: 300, width: 300 }}
              />
            </div>
            <div className="absolute top-[25.5rem] justify-center flex flex-col gap-1 ">
              <input
                className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add a caption..."
                type="text"
                value={caption}
                onChange={(e) => setcaption(e.target.value)}
              />
              <div className="flex flex-row justify-between gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition text-sm w-[100%]"
                  title="save"
                  onClick={handlesave}
                >
                  {isLoading ? (
                    <div className="absolute left-10 top-3/4 transform -translate-y-1/2 w-full">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ):("Save and upload")}
                  {/* Save and Upload */}
                </button>
                <button
                  className="p-2 z-50 border rounded-lg border-gray-200 text-sm"
                  title="cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;
