/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const { data } = await axios.get("/profile");
        console.log(data);
        setUser(data);
      }
    };

    fetchUser();
  }, []);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
