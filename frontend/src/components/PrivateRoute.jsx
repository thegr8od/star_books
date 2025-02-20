import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    dispatch(clearUser());
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
