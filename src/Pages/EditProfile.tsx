import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { updateProfile, updateProfileImage } from "../redux/Profile/Slice";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { userData } = useAppSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState("");
  const [preview, setPreview] = useState(
    "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
  );

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    bio: Yup.string().required("bio is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be of 10 digit")
      .required("Phone Number is required"),
    // profile: Yup.string(),
  });

  const initialValues = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    bio: userData?.bio || "",
    phoneNumber: userData?.phoneNumber || 0,
    // profile: userData?.coverImage.url || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const resp = await dispatch(
          updateProfile({
            firstName: values.firstName,
            lastName: values.lastName,
            bio: values.bio,
            phoneNumber: values.phoneNumber,
          })
        );
        const formData = new FormData();
        formData.append("coverImage", profile);
        await dispatch(updateProfileImage(formData as any));

        if (resp) {
          navigate("/profile");
          toast.success("User profile updated successfully")
        }
      } catch (error) {
        return error;
      }
    },
  });

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(file);
      formik.setFieldValue("profile", file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  useEffect(() => {
    if (userData?.coverImage?.url) {
      setPreview(userData.coverImage.url);
    }
  }, [userData]);

  return (
    <div className="contain">
      <form onSubmit={formik.handleSubmit} className="container">
        <div className="flex flex-row justify-between">
          <button
            onClick={handleCancel}
            className="cursor-pointer "
            type="button"
          >
            Cancel
          </button>
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button
            type="submit"
            className="text-blue-500 font-semibold cursor-pointer"
          >
            Save
          </button>
        </div>
        <div className="flex flex-col justify-center items-center pt-4">
          {preview ? (
            <img
              className="h-20 w-20 border border-slate-300 rounded-full p-1"
              alt="new profile"
              src={preview}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png")
              }
            />
          ) : (
            <img
              className="h-20 w-20"
              alt="profile image"
              src={
                userData?.coverImage.url ||
                "https://newerahospitalnagpur.com/admin/uploads/donors/4549_ad.png"
              }
            />
          )}

          <label className="cursor-pointer pt-3 text-blue-700">
            <input
              onChange={handleProfile}
              className="hidden"
              title="choose"
              type="file"
            />
            Choose Profile Photo
          </label>
        </div>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-3 items-center">
            <label className="text-gray-700 font-medium">FirstName</label>
            <div className="col-span-2">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="firstname"
                value={formik.values.firstName}
                type="text"
                name="firstName"
                placeholder={"Add Firstname"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center">
            <label className="text-gray-700 font-medium">LastName</label>
            <div className="col-span-2">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="lastName"
                type="text"
                value={formik.values.lastName}
                name="lastName"
                placeholder={"Add lastname"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center">
            <label className="text-gray-700 font-medium">Bio</label>
            <div className=" col-span-2">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="bio"
                value={formik.values.bio}
                name="bio"
                rows="3"
                placeholder="Tell us about yourself"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.bio && formik.errors.bio && (
                <div className="text-red-500 text-sm">{formik.errors.bio}</div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">
            Private Information
          </h3>
          <div className="grid grid-cols-3 items-center">
            <label className="text-gray-700 font-medium">Phone No.</label>
            <div className="col-span-2">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="phone"
                type="tel"
                value={formik.values.phoneNumber}
                name="phoneNumber"
                placeholder="Your phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phoneNumber}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
