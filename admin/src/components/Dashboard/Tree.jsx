import React, { useContext, useState } from "react";
import { TreeContextProvider, TreeContext } from "../../Contexts/TreeContext";
import axios from "axios";

import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

import { animateScroll as scroll } from "react-scroll";

import Popup from "../PopUp/popup.jsx";
import  {useNavigate} from 'react-router-dom';

toast.configure();

const Node = ({ index, title, type, parent, level, settree, data }) => {
  const { treeData, SET_TREE_DATA } = useContext(TreeContext);
  const [popup, setPopup] = useState(false);

  const style = {
    paddingLeft: `${level * 3}rem`,
  };

  const addChild = () => {
    var i = index + 1;
    for (i; i < treeData.length; i++) {
      if (treeData[i].level < level || treeData[i].level === level) {
        break;
      }
    }
    SET_TREE_DATA([
      ...treeData.slice(0, i),
      {
        title: "",
        type: "item",
        parent: index,
        level: level + 1,
        data: {
          image: false,
          excel: false,
          pdf: false,
          text: false,
          web: false,
        },
      },
      ...treeData.slice(i),
    ]);
  };

  const smartDelete = () => {
    var i = index + 1;
    for (i; i < treeData.length; i++) {
      if (treeData[i].level < level || treeData[i].level === level) {
        break;
      }
    }
    SET_TREE_DATA([...treeData.slice(0, index), ...treeData.slice(i)]);
  };

  return (
    <div className="flex my-2" style={settree ? style : {}}>
      <div className="flex space-x-4">
        <input
          disabled
          className="placeholder:italic placeholder:text-gray-400 bg-white border border-gray-300 rounded-sm py-2 px-3 w-96 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          value={treeData[index].title}
        />

        <button
          onClick={() => {
            setPopup(!popup);
          }}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
          </svg>
        </button>
        {popup && (
          <Popup
            setPopup={setPopup}
            popup={popup}
            data={{ index, title, type, parent, level, data }}
            smartDelete={smartDelete}
          />
        )}
        {type === "section" ? (
          <button onClick={addChild}>
            <svg
              className="h-6 w-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const App = (props) => {
  const { treeData, templateName, settemplateName } = useContext(TreeContext);
  const [settree, settreeSet] = useState(true);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
        onClick={() => {
          settreeSet(!settree);
        }}
      >
        Toggle Tree View
      </button>
      <br />
      <input
        className="placeholder:italic mt-4 mb-8 placeholder:text-gray-400 bg-white border border-gray-300 rounded py-2 px-3 w-2/5 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
        type="text"
        value={templateName}
        onChange={(e) => settemplateName(e.target.value)}
      />
      {treeData.map((item, index) => {
        return <Node key={index} {...item} settree={settree} index={index} />;
      })}
    </>
  );
};

const TreeUpload = ({ scrollMeDown }) => {
  const { setUPDATE, treeData, SET_TREE_DATA, templateID, templateName } =
    useContext(TreeContext);

  const toastId = React.useRef(null);
  const navigate = useNavigate();

  const notify = () => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.success("Uploaded Successfully", {
        position: "top-right",
        transition: Slide,
        autoClose: 800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex space-x-4 mt-8">
      <div>
        <button
          className="font-semibold rounded-md bg-red-500 text-white px-3 py-2"
          onClick={() => {
            scroll.scrollToBottom();
            SET_TREE_DATA([
              ...treeData,
              {
                title: "",
                type: "section",
                parent: null,
                level: 0,
                data: null,
              },
            ]);
          }}
        >
          Add
        </button>
      </div>
      <div>
        <button
          className="font-semibold rounded-md bg-red-500 text-white px-3 py-2"
          onClick={() => {
            axios.post("/api/data", {
              name: templateName,
              data: treeData,
              templateID: templateID,
            });
            setUPDATE(false);

            notify();

            console.log(
              `%c${templateName}\n\n${JSON.stringify(
                treeData,
                null,
                2
              )}\n\n${templateID}`,
              "color: green; background: yellow; font-size: 20px"
            );
          }}
        >
          Upload
        </button>
      </div>
      <div>
        <button
          className="font-semibold rounded-md bg-blue-500 text-white px-3 py-2"
          onClick={() => {
            scroll.scrollToTop();
            axios
              .post(`/api/dashboard/create/${templateID}`, {})
              .then((res) => {
                navigate("/admin/dashboard");
              });
          }}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

const Wrapper = () => {
  const { TemplateId } = useParams();
  const { UPDATE, settemplateName, setTreeData, settemplateID } =
    useContext(TreeContext);

  React.useEffect(() => {
    axios
      .get(`/api/dashboard/create/${TemplateId}`)
      .then((res) => {
        settemplateName(res.data.data.name);
        setTreeData(res.data.data.layout);
        settemplateID(res.data.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setTreeData, settemplateName, TemplateId, settemplateID]);

  return (
    <div className="flex flex-row gap-x-8">
      <div className="basis-8/12 border-r-2 border-white">
        <App />
        {/* <input type="hidden" value="scrollme" /> */}
      </div>
      <div className="basis-4/12">
        <div className="sticky top-8">
          <TreeUpload />
          {UPDATE && (
            <div
              id="alert-additional-content-4"
              className="p-4 mb-4 bg-yellow-100 rounded-lg dark:bg-yellow-200 my-4"
              role="alert"
            >
              <div className="flex items-center">
                <svg
                  className="mr-2 w-5 h-5 text-yellow-700 dark:text-yellow-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-800">
                  Unsaved Changes
                </h3>
              </div>
              <div className="mt-2 mb-4 pl-7 text-sm text-yellow-700 dark:text-yellow-800">
                You are seeing this message because you have unsaved changes,
                please save your changes before leaving this page.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Tree = (props) => {
  return (
    <TreeContextProvider>
      <Wrapper />
    </TreeContextProvider>
  );
};
