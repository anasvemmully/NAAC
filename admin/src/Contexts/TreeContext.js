import React, { createContext, useState } from "react";
import { toast, Slide } from "react-toastify";

// import axios from "axios";

export const TreeContext = createContext();
export const TreeContextProvider = (props) => {
  const [treeData, setTreeData] = useState([]);
  const [templateID, settemplateID] = useState(null);
  const [templateName, settemplateName] = useState("");
  const toastId = React.useRef(null);

  const [UPDATE, setUPDATE] = useState(false);

  const SET_TREE_DATA = (e) => {
    if (UPDATE === true) {
      setTreeData(e);
    } else if (UPDATE === false || UPDATE === undefined) {
      setTreeData(e);
      setUPDATE(true);
    }
  };

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

  return (
    <TreeContext.Provider
      value={{
        UPDATE,
        setUPDATE,
        SET_TREE_DATA,
        settemplateID,
        settemplateName,
        templateName,
        treeData,
        setTreeData,
        templateID,
        notify
      }}
    >
      {props.children}
    </TreeContext.Provider>
  );
};
