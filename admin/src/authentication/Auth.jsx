import { useRef, createContext, useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import { toast, Slide } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const toastId = useRef(null);
  const [user, setUser] = useState({
    isAuthenticated: false,
    isAdmin: false,
    username: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    // (user);
    if (user) {
      setUser(JSON.parse(atob(user)));
    }
  }, []);

  const notify = (message, type = "success") => {
    return function () {
      if (!toast.isActive(toastId.current)) {
        if (type === "success") {
          toastId.current = toast.success(message, {
            position: "top-right",
            transition: Slide,
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        } else if (type === "error") {
          toastId.current = toast.error(message, {
            position: "top-right",
            transition: Slide,
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
      }
    };
  };

  const Signout = () => {
    axios
      .post(`/api/logout`)
      .then((res) => {
        setMessage(res.data.message);
        setUser({
          isAuthenticated: false,
          isAdmin: false,
          username: "",
          email: "",
        });
        localStorage.removeItem("user");
      })
      .catch((err) => {});
  };
  const value = {
    user,
    setUser,
    Signout,
    error,
    notify,
    setError,
    message,
    setMessage,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  return { user, setUser };
};

export const RequireAuth = ({ children }) => {
  let auth = useAuth();
  if (auth.user.isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  } else {
    return children;
  }
};

export const RequireAuthManage = ({ children }) => {
  let auth = useAuth();
  if (auth.user.isAuthenticated && auth.user.isAdmin) {
    return children;
  } else {
    return <Navigate to="/admin" />;
  }
};

//
