import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";

function PlacesFormPage() {
  const { id } = useParams();
  // console.log(id);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) {
        return;
      }

      const { data } = await axios.get(`/places/${id}`);

      setTitle(data?.title);
      setAddress(data?.address);
      setAddedPhotos([...(data?.photos || [])]);
      setDescription(data?.description);
      setPerks(data?.perks);
      setExtraInfo(data?.extraInfo);
      setCheckIn(data?.checkIn);
      setCheckOut(data?.checkOut);
      setMaxGuests(data?.maxGuests);
    };
    fetchPlace();
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function handleSavePlace(e) {
    e.preventDefault();
    const data = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    };
    if (id) {
      // update
      await axios.put("/places", { id, ...data });
      setRedirect(true);
    } else {
      // new place

      await axios.post("/places", data);
      setRedirect(true);
    }
    //   const res = await axios.post("/places", data);
    //   const result = res.json();
    //   console.log(result);
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={handleSavePlace}>
        {preInput("Title", "Title for your place. Should be short and catchy as in advertisement.")}
        <input
          type="text"
          placeholder="title, for example: 'My lovely apartment'"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {preInput("Address", "Address to this place")}
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {preInput("Photos", "Upload photos of the place")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Description of the place")}
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        {preInput("Perks", "Select all the perks of your place")}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput("Extra info", "house rules, etc")}
        <textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} />

        {preInput(
          "Check in & out times",
          "add check in and out time, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-1">Check-in time</h3>
            <input
              type="text"
              placeholder="12:00pm"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check-out time</h3>
            <input
              type="text"
              placeholder="12:00pm"
              value={checkOut || ""}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guest</h3>
            <input
              type="number"
              placeholder="3 guests maximum"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
export default PlacesFormPage;
