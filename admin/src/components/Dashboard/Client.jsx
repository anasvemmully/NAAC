/* eslint-disable array-callback-return */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useParams } from "react-router-dom";
import { ClientContext } from "../../authentication/ClientAuth";

import fileDownload from "js-file-download";

export const DashboardClient = () => {
  const { notify, Signout } = React.useContext(ClientContext);

  const [MemberTemplate, setMemeberTemplate] = useState([]);
  const [SearchTemplate, setSearchTemplate] = useState([]);

  useEffect(() => {
    axios.get(`/api/d/dashboard`).then((res) => {
      if (res.data.success) {
        setMemeberTemplate(res.data.template);
        setSearchTemplate(res.data.template);
      } else {
        notify(res.data.message)();
        Signout();
      }
    });
  }, [Signout, notify]);

  const filterRoles = React.useCallback(
    (e) => {
      setSearchTemplate(
        MemberTemplate.filter((member) =>
          member.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    },
    [MemberTemplate]
  );

  return (
    <>
      <div>
        <div className="my-4 pl-4 text-white underline underline-offset-4">
          <span>Fill the form : </span>
        </div>
        <div className="my-8 sm:w-2/4 lg:w-1/4">
          <label
            htmlFor="email-adress-icon"
            className="block mb-2 text-xs font-medium text-white"
          >
            Search :
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              onChange={filterRoles}
            />
          </div>
        </div>
        <div className="overflow-x-scroll sm:overflow-x-hidden pb-4 flex sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 mb-8">
          {SearchTemplate &&
            SearchTemplate.map((e, index) => {
              return (
                <div key={index} className="bg-slate-50 p-4 rounded group">
                  <Link
                    to={`/d/dashboard/manage/${e.id}`}
                    className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base "
                  >
                    <span className="font-semibold text-slate-600 group-hover:text-blue-500">
                      {e.name}
                    </span>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const FillClient = () => {
  const { Signout } = React.useContext(ClientContext);

  const [template, setTemplate] = useState([]);
  const { templateid } = useParams();

  useEffect(() => {
    axios.post(`/api/d/dashboard`, { templateid: templateid }).then((res) => {
      if (res.data.success) {
        setTemplate(res.data.template);
      } else {
        Signout();
      }
    });
  }, [Signout, templateid]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-x-8 text-white">
      <div className="basis-8/12 lg:border-r-2 lg:border-white lg:pr-6">
        {template && (
          <div className="pl-1 lg:pl-4">
            <div className="font-semibold text-xl">{template.name}</div>
            <div className="flex py-1">
              <svg
                className="mr-2 w-4 h-4"
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
              <div className="text-xs">Upload files in to the form !</div>
            </div>
          </div>
        )}
        <div className="pl-1 lg:pl-4">
          {template &&
            template.layout?.map((e, i) => (
              <TemplateView key={e.index} data={e} id={`section-${i}`} />
            ))}
        </div>
      </div>
      <div className="basis-4/12 hidden lg:block">
        <div className="sticky top-8 rounded p-4 mb-2">
          <div>
            <span className="font-semibold">Table of Contents : </span>

            {template.layout &&
              // eslint-disable-next-line array-callback-return
              template.layout.map((e, i) => {
                if (e.type === "section") {
                  return (
                    <li
                      style={{
                        marginLeft: `${e.level * 1.6}rem`,
                      }}
                      key={i}
                      className="text-sm py-2 pl-5 border-l-2 border-slate-500 list-none"
                    >
                      <a href={`#section-${i}`}>
                        {e.title.slice(0, 40) +
                          (e.title.length > 40 ? "..." : "")}
                      </a>
                    </li>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateView = ({ data, id }) => {
  const [PopUp, setPopUp] = useState(false);
  let style = {
    marginLeft: `${data.level * 3}rem`,
  };

  if (data.type === "section") {
    return (
      <div id={id} className="flex items-center py-1" style={style}>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <div>{data.title}</div>
      </div>
    );
  } else {
    const res = {
      type: data.type,
      index: data.index,
      level: data.level,
      parent: data.parent,
      title: data.title,
      data: data.data,
      keyword: data.keyword,
    };

    return (
      <div className="p-3 ml-7 border mb-2 rounded" style={style}>
        <div className="mb-4">{data.title}</div>
        <div className="flex justify-end	border-t border-slate-500	pt-2">
          <button
            onClick={() => {
              setPopUp(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </button>
          {PopUp && <Popup data={res} setPopup={setPopUp} />}
        </div>
      </div>
    );
  }
};

const Popup = (props) => {
  const { data, setPopup } = props;
  const { templateid } = useParams();

  const {
    // treeData, SET_TREE_DATA, templateID,
    notify,
  } = React.useContext(ClientContext);
  const [Data, setData] = useState({
    title: "",
    type: "",
    parent: "",
    level: "",
    index: "",
    data: null,
  });
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState([]);
  const fileInput = React.useRef();

  useEffect(() => {
    setData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data.index, notify]);

  const getInfo = React.useCallback(() => {
    axios
      .post(`/api/d/template/getFile`, {
        templateid: templateid,
        index: Data.index,
      })
      .then((res) => {
        if (res.data.success) {
          setFileInfo(res.data.file);
        }
      })
      .catch((err) => {
        notify(err.response.data.message, "error");
      });
  }, [Data.index, notify, templateid]);

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
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
            clipRule="evenodd"
          />
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
          templateid: templateid,
          index: Data.index,
        })
      );

      if (file) {
        axios
          .post(`/api/d/template/upload-file`, data, {
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
    [Data.index, file, getInfo, notify, templateid]
  );

  const DeleteFile = React.useCallback(
    (e, i) => {
      return () => {
        axios
          .post(`/api/d/template/delete`, {
            index: Data.index,
            fileIndex: i,
            templateid: templateid,
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
    [Data.index, getInfo, notify, templateid]
  );

  const DownloadFile = React.useCallback(
    (e) => {
      return () => {
        axios
          .get(`/api/d/template/download`, {
            params: {
              templateid: templateid,
              index: Data.index,
              file: e,
            },
            responseType: "blob",
          })
          .then((res) => fileDownload(res.data, e.name))
          .catch((err) => notify(err.response.data.message, "error")());
      };
    },
    [Data.index, notify, templateid]
  );

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
                  <div className="pb-8">
                    <div className="h-28 border-2 rounded-md mt-4">
                      {fileInfo && fileInfo ? (
                        <div className="flex flex-nowrap overflow-hidden overflow-x-scroll scrollbar scrollbar-thumb-blue-500 scrollbar-track-blue-300 gap-2 p-1.5 pb-4">
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
                                  <div className="text-slate-500 bg-blue-200 hover:opacity-10 mx-auto py-3 px-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardClientHeader = () => {
  const { user, Signout } = React.useContext(ClientContext);

  return (
    <div className="font-sans bg-[#081D60]">
      <div className="bg-white border-b-2 border-gray-300 py-6">
        <div className="px-12 flex justify-between">
          <div className="flex gap-x-12">
            <NavLink to="/d/dashboard" className="font-semibold">
              <div>DashBoard</div>
            </NavLink>
            <NavLink to="/" className="font-semibold">
              <div>Home</div>
            </NavLink>
          </div>
          <div className="flex gap-x-12">
            <div className="hidden sm:block ">
              <span>Hi {user.email || "Anonymous"}</span>
            </div>
            <button onClick={Signout} className="px-3">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <span className="pl-2 hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-8 pt-10 pb-16 text-white">
        <Outlet />
      </div>
    </div>
  );
};
