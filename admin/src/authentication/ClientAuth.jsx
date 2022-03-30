import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast , Slide } from "react-toastify";

export const ClientContext = createContext();

toast.configure();

export const ClientProvider = ({ children }) => {
  const [user, setUser] = useState({
    isActive: false,
    us341D: "",
    email: "",
  });

  const toastId = React.useRef(null);

  const naviagate = useNavigate();
  // const [error, setError] = useState(null);
  // const [message, setMessage] = useState(null);

  const notify = (message) => {
    return function () {
      if (!toast.isActive(toastId.current)) {
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
      }
    };
  };
  useEffect(() => {
    const user = localStorage.getItem("U3/r");
    if (user) {
      setUser(JSON.parse(atob(user)));
    }
  }, []);

  const Signout = useCallback(() => {
    setUser({
      isActive: false,
      Us341D: "",
      email: "",
    });
    axios
      .post("/api/d/logout", {
        id: user.Us341D,
      })
      .then((res) => {
        if (res.data.success) {
          localStorage.removeItem("U3/r");
          notify(res.data.message)();
          naviagate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [naviagate, user.Us341D]);

  

  const value = {
    notify,
    user,
    setUser,
    Signout,
    // error,
    // setError,
    // message,
    // setMessage,
  };
  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useAuth = () => {
  const { user, setUser } = useContext(ClientContext);
  return { user, setUser };
};

export const RequireClient = ({ children }) => {
  let auth = useAuth();
  if (auth.user.isActive) {
    return <Navigate to="/d/dashboard" />;
  } else {
    return children;
  }
};

export const RequireClientManage = ({ children }) => {
  let auth = useAuth();
  if (auth.user.isActive && auth.user.Us341D) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

//
