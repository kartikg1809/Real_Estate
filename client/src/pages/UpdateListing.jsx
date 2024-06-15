import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import React, { useState,useEffect } from "react";
  import { app } from "../firebase";
  import { MdDeleteOutline } from "react-icons/md";
  import { useSelector } from "react-redux";
  import { useNavigate,useParams } from "react-router-dom";
  
  const UpdateListing = () => {
    const navigate=useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updated,setUpdated]=useState(false);
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: "",
      description: "",
      address: "",
      type: "rent",
      bedroom: "",
      bathroom: "",
      regularPrice: "",
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
  
    const handleImageSubmit = (e) => {
      if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises)
          .then((urls) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              imageUrls: prevFormData.imageUrls.concat(urls),
            }));
            setImageUploadError(false);
            setUploading(false);
          })
          .catch((error) => {
            setImageUploadError("Image upload Failed (2 mb max per image)");
          });
      } else {
        setImageUploadError("You can only add 6 images");
        setUploading(false);
      }
    };
  
    const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
  
    const handleRemoveImage = (index) => {
      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((url, i) => i != index),
      });
    };
  
    const handleChange = (e) => {
      if (e.target.id === "sale" || e.target.id === "rent") {
        setFormData({
          ...formData,
          type: e.target.id,
        });
      } else if (
        e.target.id === "parking" ||
        e.target.id === "furnished" ||
        e.target.id === "offer"
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
        });
      } else {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (formData.imageUrls.length < 1)
          return setError("You must upload at least one image");
        if (+formData.regularPrice < +formData.discountPrice)
          return setError("Discount price must be lower than regular price");
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/update/${params.listingId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
        }
        setUpdated(true);
        navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    useEffect(()=>{
        const fetchListing=async()=>{
            const listingId=params.listingId;
            const res=await fetch(`/api/listing/get/${listingId}`);
            const data=await res.json();
            if(data.success===false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };
        fetchListing();
    },[]);
    return (
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Update Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 p-6"
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedroom"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bedroom}
                  className="border border-gray-300 p-1 rounded-lg"
                />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathroom"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bathroom}
                  className="border border-gray-300 p-1 rounded-lg"
                />
                <p>Bath</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  required
                  className="border border-gray-300 p-1 rounded-lg"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col item-center">
                  <p>Regular Price</p>
                  <span className="text-small">(₹/month)</span>
                </div>
              </div>
              {formData.offer&&(
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="border border-gray-300 p-1 rounded-lg"
                />
                <div className="flex flex-col item-center">
                  <p>Discounted Price</p>
                  <span className="text-small">(₹/month)</span>
                </div>
              </div>)}
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                disabled={uploading}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "uploading..." : "upload"}
              </button>
            </div>
            <p className="text-red-600 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div className="flex justify-between p-3 border items-center">
                  <img
                    key={index}
                    src={url}
                    alt="listing-image"
                    className="w-20 h-20 object-contain rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg text-2xl uppercase hover:opacity-95"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              ))}
            <button disabled={loading||uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              {loading ? "Updating your listing..." : "Update Listing"}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {updated && <p className="text-green-600 text-sm">Listing updated successfully</p>}
          </div>
        </form>
      </main>
    );
  };
  
  export default UpdateListing;
  