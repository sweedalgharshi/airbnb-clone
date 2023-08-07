/* eslint-disable  */
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { user, isLoading, setUser } = useContext(UserContext);
  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }
  // console.log(subpage);

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (isLoading) {
    return <h2 className="text-center mt-14 font-bold">Loading....</h2>;
  }

  if (isLoading && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  function linkClasses(type = null) {
    let classes = "py-2 px-6";
    if (type === subpage) {
      classes += " bg-primary rounded-full text-white";
    }

    return classes;
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link to={"/account"} className={linkClasses("profile")}>
          My Profile
        </Link>
        <Link to={"/account/bookings"} className={linkClasses("bookings")}>
          My Bookings
        </Link>
        <Link to={"/account/places"} className={linkClasses("places")}>
          My Accomodations
        </Link>
      </nav>

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user?.name} ({user?.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-4">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
export default AccountPage;
