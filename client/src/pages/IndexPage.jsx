import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/places");
      const data = await res.data;
      // console.log(data);
      setPlaces(data);
    };
    fetchData();
  }, []);

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => {
          return (
            <Link to={`/place/${place._id}`} key={place._id}>
              <div className="bg-gray-500 rounded-2xl flex mb-2">
                {place.photo?.[0] && (
                  <img
                    src={`http://localhost:4000/uploads/${place.photo?.[0]}`}
                    alt=""
                    className="rounded-2xl aspect-square object-cover"
                  />
                )}
              </div>

              <h2 className="font-bold ">{place.address}</h2>
              <h3 className="text-sm text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">${place.price}</span> per night
              </div>
            </Link>
          );
        })}
    </div>
  );
}
export default IndexPage;
