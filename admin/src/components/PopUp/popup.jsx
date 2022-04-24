/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from "react";
import { TreeContext } from "../../Contexts/TreeContext";
import fileDownload from "js-file-download";

import "flowbite";
import axios from "axios";

const Popup = (props) => {
  const { data, setPopup, smartDelete } = props;

  const { treeData, SET_TREE_DATA, templateID, notify } =
    useContext(TreeContext);
  const [Data, setData] = useState({
    title: "",
    type: "",
    parent: "",
    level: "",
    index: "",
    data: null,
  });
  const [update, setUpdate] = useState(false);
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState([]);
  const fileInput = React.useRef();

  const setUpdateData = (data) => {
    if (update === false) {
      setData(data);
      setUpdate(true);
    } else {
      setData(data);
    }
  };

  useEffect(() => {
    setData(data);
    return () => {
      setUpdate(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data.index, notify, templateID]);

  const getInfo = React.useCallback(() => {
    axios
      .post(`/api/dashboard/template/getFile`, {
        templateid: templateID,
        index: Data.index,
      })
      .then((res) => {
        if (res.data.success) {
          setFileInfo(res.data.file);
        }
      })
      .catch((err) => {});
  }, [Data.index, templateID]);

  const getFileInfo = React.useCallback((e) => {
    if (
      e.file_name.endsWith(".jpg") ||
      e.file_name.endsWith(".png") ||
      e.file_name.endsWith(".jpeg")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (e.file_name.endsWith("txt")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (e.file_name.endsWith("pdf")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (e.file_name.endsWith("xlsx") || e.file_name.endsWith("xls")) {
      return (
        <svg
          fill="grey"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className="h-8 w-8"
        >
          {" "}
          <path d="M 15 3 A 2 2 0 0 0 14.599609 3.0429688 L 14.597656 3.0410156 L 4.6289062 5.0351562 L 4.6269531 5.0371094 A 2 2 0 0 0 3 7 L 3 23 A 2 2 0 0 0 4.6289062 24.964844 L 14.597656 26.958984 A 2 2 0 0 0 15 27 A 2 2 0 0 0 17 25 L 17 5 A 2 2 0 0 0 15 3 z M 19 5 L 19 8 L 21 8 L 21 10 L 19 10 L 19 12 L 21 12 L 21 14 L 19 14 L 19 16 L 21 16 L 21 18 L 19 18 L 19 20 L 21 20 L 21 22 L 19 22 L 19 25 L 25 25 C 26.105 25 27 24.105 27 23 L 27 7 C 27 5.895 26.105 5 25 5 L 19 5 z M 23 8 L 24 8 C 24.552 8 25 8.448 25 9 C 25 9.552 24.552 10 24 10 L 23 10 L 23 8 z M 6.1855469 10 L 8.5878906 10 L 9.8320312 12.990234 C 9.9330313 13.234234 10.013797 13.516891 10.091797 13.837891 L 10.125 13.837891 C 10.17 13.644891 10.258531 13.351797 10.394531 12.966797 L 11.785156 10 L 13.972656 10 L 11.359375 14.955078 L 14.050781 19.998047 L 11.716797 19.998047 L 10.212891 16.740234 C 10.155891 16.625234 10.089203 16.393266 10.033203 16.072266 L 10.011719 16.072266 C 9.9777187 16.226266 9.9105937 16.458578 9.8085938 16.767578 L 8.2949219 20 L 5.9492188 20 L 8.7324219 14.994141 L 6.1855469 10 z M 23 12 L 24 12 C 24.552 12 25 12.448 25 13 C 25 13.552 24.552 14 24 14 L 23 14 L 23 12 z M 23 16 L 24 16 C 24.552 16 25 16.448 25 17 C 25 17.552 24.552 18 24 18 L 23 18 L 23 16 z M 23 20 L 24 20 C 24.552 20 25 20.448 25 21 C 25 21.552 24.552 22 24 22 L 23 22 L 23 20 z" />
        </svg>
      );
    }
  }, []);

  const UploadFile = React.useCallback(
    (e) => {
      e.preventDefault();
      const data = new FormData();
      data.append("file", file);
      data.append(
        "misc",
        JSON.stringify({
          templateid: templateID,
          index: Data.index,
        })
      );

      if (file) {
        axios
          .post(`/api/dashboard/template/upload-file`, data, {
            headers: {
              // "Content-Type": "multipart/form-data",
              "Content-Type": "application/octet-stream",
            },
          })
          .then((res) => {
            if (res.data.success) {
              // setPopUp2(false);
              fileInput.current.value = "";
              setFile(null);
              notify(res.data.message)();
              getInfo();
            }
          })
          .catch((error) => {
            fileInput.current.value = "";
            setFile(null);
            notify(error.response.data.message, "error")();
          });
      } else {
        notify("Please select a file", "error")();
      }
    },
    [Data.index, file, getInfo, notify, templateID]
  );

  const DeleteFile = React.useCallback(
    (e, i) => {
      return () => {
        axios
          .post(`/api/dashboard/template/delete`, {
            index: Data.index,
            fileIndex: i,
            templateid: templateID,
            path: e.path,
          })
          .then((res) => {
            if (res.data.success) {
              notify(res.data.message)();
              getInfo();
            }
          })
          .catch((err) => {
            notify(err.response.data.message, "error")();
          });
      };
    },
    [Data.index, getInfo, notify, templateID]
  );

  const DownloadFile = React.useCallback(
    (e) => {
      return () => {
        axios
          .get(`/api/dashboard/template/download`, {
            params: {
              templateid: templateID,
              index: Data.index,
              file: e,
            },
            responseType: "blob",
          })
          .then((res) => fileDownload(res.data, e.name))
          .catch((err) => notify(err.response.data.message, "error")());
      };
    },
    [Data.index, notify, templateID]
  );

  const help = {
    get isChildrenAvailable() {
      if (treeData.length === 1) return false;
      else if (treeData.length === Data.index + 1) return false;
      else if (treeData[Data.index + 1].level === Data.level + 1) return true;
      else return false;
    },
  };

  return (
    <div className="fixed z-50 right-0 top-0 bottom-0 backdrop-grayscale backdrop-blur-sm h-full w-full flex items-center justify-center">
      <div aria-hidden="true" className="w-11/12 sm:w-1/2 sm:h-1/2 m-auto">
        <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <div className="rounded-lg shadow bg-gray-700">
            <div className="flex justify-between items-start p-5 rounded-t border-b border-gray-300">
              <h3 className="text-xl font-semibold lg:text-2xl text-white truncate">
                <svg
                  className="h-6 w-6 text-white inline-block mr-3"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
                </svg>
                {Data.title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setPopup(false);
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6 text-white ">
              <div className="relative z-0 mb-6 w-full group ">
                <input
                  type="text"
                  name="title"
                  value={Data.title}
                  onChange={(e) => {
                    setUpdateData({ ...Data, title: e.target.value });
                  }}
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="title"
                  className="absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Title
                </label>
              </div>

              <label
                htmlFor="toggle-section"
                className={
                  "flex relative items-center mb-1 " +
                  (help.isChildrenAvailable === true
                    ? "cursor-not-allowed"
                    : "cursor-pointer")
                }
              >
                <input
                  type="checkbox"
                  disabled={help.isChildrenAvailable === true ? "disabled" : ""}
                  checked={Data.type === "section" ? "checked" : ""}
                  id="toggle-section"
                  className="sr-only"
                  onChange={(e) => {
                    setUpdateData({
                      ...Data,
                      type: e.target.checked ? "section" : "item",
                      // data  : e.target.checked ? null : Data.data,
                    });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
                <span className="ml-3 text-sm font-medium text-white dark:text-gray-300">
                  Is this a Section ?
                </span>
              </label>
              {fileInfo && (
                <p className="text-red-400 font-bold text-xs">
                  <svg
                    className="mr-1 w-5 h-5 inline-block text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Toggling this will remove the file!
                </p>
              )}
              {help.isChildrenAvailable === true ? (
                <p className="text-red-400 font-bold text-sm">
                  <svg
                    className="mr-1 w-5 h-5 inline-block text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  There are already items in this section !
                </p>
              ) : (
                ""
              )}

              {Data.type === "item" ? (
                <div className="flex flex-col">
                  <p className="text-white font-bold text-xs pb-2 w-full">
                    Upload image / excel / pdf :
                  </p>
                  <div>
                    <form>
                      <div className="flex gap-3 items-center text-white">
                        <input
                          className="block w-full text-sm font-bold rounded-lg bg-red-500 border border-gray-300 cursor-pointer focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          aria-describedby="user_avatar_help"
                          id="user_avatar"
                          // accept={help.file_accept_string}
                          type="file"
                          ref={fileInput}
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button
                          type="button"
                          onClick={UploadFile}
                          className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Upload</span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div>
                    <div className="h-28 border-2 rounded-md mt-4">
                      {fileInfo?.length > 0 ? (
                        <div className="flex flex-nowrap overflow-hidden overflow-x-scroll scrollbar scrollbar-thumb-blue-500 scrollbar-track-blue-300 gap-2 p-1.5 pb-7">
                          {fileInfo?.map((e, i) => (
                            <div
                              key={i}
                              className="h-24 w-32 border-2 rounded-md border-dashed "
                            >
                              <div className="">
                                <div className="flex flex-col-reverse">
                                  <button
                                    className="cursor-pointer mx-auto p-1"
                                    onClick={DeleteFile(e, i)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                  <div className="text-slate-500 bg-blue-100 hover:opacity-70 mx-auto py-3 px-8">
                                    <button onClick={DownloadFile(e)}>
                                      {getFileInfo(e)}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center place-content-center">
                          <div className="flex gap-2 items-center text-red-300 font-bold p-10">
                            <span>Upload Some files</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                                clipRule="evenodd"
                              />
                              <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center p-6 pb-3 space-x-2 rounded-b border-t border-white-300 ">
              <button
                type="button"
                onClick={() => {
                  if (update) {
                    let tmp = {
                      title: Data.title,
                      type: Data.type,
                      parent: Data.parent,
                      level: Data.level,
                      data: Data.type === "section" ? null : Data.data,
                    };
                    axios
                      .post(`/api/dashboard/template/updateChild`, {
                        index: Data.index,
                        id: templateID,
                        data: tmp,
                      })
                      .then((res) => {
                        if (res.data.success) {
                          treeData[Data.index] = tmp;
                          SET_TREE_DATA([...treeData]);
                          setPopup(false);
                        }
                      })
                      .catch(() => {
                        notify("Something went wrong!")();
                      });
                  } else {
                    setPopup(false);
                  }
                  // setData({
                  //   title: "",
                  //   type: "",
                  //   parent: "",
                  //   level: "",
                  // });
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => {
                  smartDelete();
                  setPopup(false);
                }}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
              >
                Delete
              </button>
            </div>
            {help.isChildrenAvailable === true ? (
              <p className="p-6 pt-3 text-red-400 font-bold text-sm">
                <svg
                  className="mr-1 w-5 h-5 inline-block text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Deleting this item will also delete all its children.
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
