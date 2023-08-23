import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PhotoGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchBooking = async () => {
        const res = await axios.get("/bookings");
        const foundBooking = res.data.find(({ _id }) => _id === id);
        // console.log(foundBooking);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      };
      fetchBooking();
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className={"my-2 block"}>{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 rounded-2xl text-white">
          <div>Total Price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PhotoGallery place={booking.place} />
    </div>
  );
}
export default BookingPage;
