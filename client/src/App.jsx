import "./App.css";

import { UserContextProvider } from "./context/UserContext";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

import IndexPage from "./pages/IndexPage";
import Login from "./pages/Login";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/AccountPage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/placePage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
