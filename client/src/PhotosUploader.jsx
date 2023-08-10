/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";

function PhotosUploader({ addedPhotos, onChange }) {
  const [linkPhoto, setLinkPhoto] = useState("");
  async function addPhotoByLink(e) {
    e.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", { link: linkPhoto });
    console.log(filename);
    onChange((prev) => [...prev, filename]);
    setLinkPhoto("");
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    const { data: filenames } = await axios.post("/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(filenames);
    onChange((prev) => [...prev, ...filenames]);
  }
  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="'Add using a link....jpg'"
          value={linkPhoto}
          onChange={(e) => setLinkPhoto(e.target.value)}
        />
        <button className="bg-gray-200 px-4 rounded-2xl" onClick={addPhotoByLink}>
          Add&nbsp;photo
        </button>
      </div>
      <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link, i) => (
            <div key={i} className="h-32 flex">
              <img
                className="rounded-2xl w-full object-cover"
                src={`http://localhost:4000/uploads/${link}`}
                alt=""
              />
            </div>
          ))}
        <label className="h-32 cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
          <input type="file" className="hidden" onChange={uploadPhoto} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}
export default PhotosUploader;
