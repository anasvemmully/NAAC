/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../authentication/Auth";
import fileDownload from "js-file-download";
// import { Tree } from "./Tree";
// import Scrollspy from "react-scrollspy";

// import { toast, Slide } from "react-toastify";

export const View = () => {
  const { Signout } = React.useContext(AuthContext);

  const [template, setTemplate] = useState([]);
  const { ViewId } = useParams();

  useEffect(() => {
    axios.post(`/api/dashboard/view`, { templateid: ViewId }).then((res) => {
      if (res.data.success) {
        setTemplate(res.data.template);
      } else {
        Signout();
      }
    });
  }, [Signout, ViewId]);

  // const items = () => template?.layout
  //   .map((e, i) => {
  //     if (e.type === "section") {
  //       return `section-${i}`;
  //     }
  //   })
  //   .filter((e) => e !== undefined);

  // console.log(items());
  return (
    <div className="flex  flex-col-reverse lg:flex-row gap-x-8 text-white">
      <div className="basis-8/12 lg:border-r-2 lg:border-white lg:pr-6">
        {template && (
          <div className="p-0 sm:p-4">
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
        <div className="pl-0 sm:pl-4">
          {/* scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 max-h-96 supports-scrollbars:pr-2 lg:max-h-96 */}
          {template &&
            template.layout?.map((e, index) => (
              <TemplateViewManage
                key={index}
                data={e}
                index={index}
                id={`section-${index}`}
              />
              // !important uncomment this
            ))}
        </div>
      </div>
      <div className="hidden lg:block basis-4/12">
        <div className="sticky top-8 rounded p-4 mb-2 lg:mb-0">
          <div>
            <span className="font-semibold">Table of Contents : </span>
            {template.layout &&
              // eslint-disable-next-line array-callback-return
              template?.layout.map((e, i) => {
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

const Image = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Text = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Excel = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Pdf = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Web = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </div>
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Icon = ({ file_type }) => {
  // eslint-disable-next-line default-case
  if (file_type === "image") {
    return (
      <div className="px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  } else if (file_type === "text") {
    return (
      <div className="px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    );
  } else if (file_type === "excel") {
    return (
      <div className="px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  } else if (file_type === "pdf") {
    return (
      <div className="px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  } else if (file_type === "web") {
    return (
      <div className="px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </div>
    );
  }
};

const FileUploadPopUp = ({ setPopUp2, res, file_type }) => {
  const { index } = res;

  const { notify, Signout } = React.useContext(AuthContext);
  //Promise notify implemetation

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState("");
  const [webLink, setWebLink] = useState("");

  const { ViewId } = useParams();

  useEffect(() => {
    axios
      .post(`/api/dashboard/file`, {
        templateid: ViewId,
        index: index,
        file_type: file_type,
      })
      .then((res) => {
        if (file_type === "web") {
          setWebLink(res.data.file);
        }
        setFileInfo(res.data.file);
      });
  }, [ViewId, file_type, index]);

  const UploadFile = React.useCallback(
    (e) => {
      e.preventDefault();
      const data = new FormData();
      data.append("file", file);
      data.append(
        "misc",
        JSON.stringify({
          templateid: ViewId,
          index: index,
          file_type: file_type,
        })
      );

      if (file) {
        axios
          .post(`/api/dashboard/upload-file`, data, {
            headers: {
              // "Content-Type": "multipart/form-data",
              "Content-Type": "application/octet-stream",
            },
          })
          .then((res) => {
            if (res.data.success) {
              setPopUp2(false);
              notify(res.data.message)();
            } else {
              notify(res.data.message)();
              Signout();
            }
          });
      }
    },
    [Signout, ViewId, file, file_type, index, notify, setPopUp2]
  );
  const DownloadFile = React.useCallback(() => {
    axios
      .get(`/api/d/download/`, {
        params: {
          templateid: ViewId,
          index: index,
          type: file_type,
        },
        responseType: "blob",
      })
      .then((res) => fileDownload(res.data, fileInfo))
      .catch(() => notify("First Upload a file !")());
  }, [ViewId, fileInfo, file_type, index, notify]);

  const UpdateWeb = React.useCallback(
    (e) => {
      e.preventDefault();

      if (
        webLink.match(
          // eslint-disable-next-line no-useless-escape
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        )
      ) {
        const misc = {
          templateid: ViewId,
          index: index,
          file_type: file_type,
          webLink: webLink,
        };
        axios
          .post(`/api/dashboard/upload-file`, {
            misc: JSON.stringify(misc),
          })
          .then((res) => {
            if (res.data.success) {
              setPopUp2(false);
              notify(res.data.message)();
            } else {
              notify(res.data.message)();
            }
          })
          .catch(() => {
            Signout();
          });
      } else {
        notify("Invalid URL !")();
      }
    },
    [Signout, ViewId, file_type, index, notify, setPopUp2, webLink]
  );

  const DeleteFile = React.useCallback(() => {
    axios
      .post(`/api/dashboard/delete-file`, {
        index: index,
        type: file_type,
        templateid: ViewId,
      })
      .then((res) => {
        if (res.data.success) {
          setPopUp2(false);
          notify(res.data.message)();
        }
      })
      .catch(() => {
        Signout();
      });
  }, [ViewId, file_type, index]);

  const help = {
    // eslint-disable-next-line getter-return
    get file_accept_string() {
      if (file_type === "image") {
        return "image/png, image/jpeg, image/jpg";
      } else if (file_type === "text") {
        return "text/plain";
      } else if (file_type === "excel") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      } else if (file_type === "pdf") {
        return "application/pdf";
      }
    },
  };

  return (
    <div className="fixed z-50 right-0 top-0 bottom-0 backdrop-grayscale backdrop-blur-sm h-full w-full flex items-center justify-center">
      <div
        aria-hidden="true"
        // className="overflow-y-auto overflow-x-hidden fixed right-4 left-4 top-4 z-50 "
      >
        <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <div className="rounded-lg shadow bg-gray-700">
            <div className="flex  gap-52 justify-between items-start p-5 rounded-t border-b border-gray-300">
              <h3 className="flex items-center text-xl font-semibold lg:text-2xl text-white">
                <Icon file_type={file_type} />
                <div>Upload {file_type}</div>
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setPopUp2(false);
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

            {file_type === "web" ? (
              <form>
                <div className="m-6 pb-6">
                  <label
                    htmlFor="website-admin"
                    className="block mb-2 text-sm font-medium "
                  >
                    Enter the {file_type} link :
                  </label>
                  <div className="flex text-slate-700">
                    <span className="inline-flex items-center px-3 text-sm bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:border-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      onChange={(e) => setWebLink(e.target.value)}
                      id="website-admin"
                      value={webLink}
                      className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="http://..."
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={UpdateWeb}
                      className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                </div>
              </form>
            ) : (
              <div>
                <div className="mx-6 mt-6">
                  {fileInfo ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold">
                        File uploaded : {fileInfo}
                      </span>
                      <button className="ml-auto mr-2 text-red-400" onClick={DeleteFile}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold">File not uploaded</span>
                    </div>
                  )}
                </div>
                <form>
                  <div className="p-6 text-white">
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="user_avatar"
                    >
                      Upload {file_type} :
                    </label>
                    <input
                      className="block w-full text-sm font-bold rounded-lg bg-red-500 border border-gray-300 cursor-pointer focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      aria-describedby="user_avatar_help"
                      id="user_avatar"
                      accept={help.file_accept_string}
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <div
                      className="flex items-center gap-2 mt-4 text-xs"
                      id="user_avatar_help"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-white-500 font-bold">
                        Upload/Re-upload the {file_type}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={UploadFile}
                      className="mt-4 flex items-center gap-2 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 "
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
                <div className="mx-6 mb-6 py-6 text-white border-t-4 border-slate-400 border-double">
                  <span className="block mb-2 text-sm font-medium">
                    Download {file_type} :
                  </span>
                  <button
                    onClick={DownloadFile}
                    className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Download</span>
                  </button>
                  <div className="flex items-center gap-2 mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-white-500 font-bold text-xs ">
                      Download the {file_type} to view !
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateViewManage = ({ data, index, id }) => {
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
      index: index,
      level: data.level,
      parent: data.parent,
      title: data.title,
    };
    const data_types = data.data
      ? Object.keys(data.data).filter((f) => data.data[f] === true)
      : null;
    return (
      <div className="p-3 ml-7 border mb-2 rounded" style={style}>
        <div className="mb-4">{data.title}</div>
        <div className="flex justify-end	border-t border-slate-500	pt-2">
          {data_types &&
            // eslint-disable-next-line array-callback-return
            data_types.map((f, index) => {
              // eslint-disable-next-line default-case
              switch (f) {
                case "image":
                  return <Image key={index} res={res} file_type={f} />;
                case "text":
                  return <Text key={index} res={res} file_type={f} />;
                case "excel":
                  return <Excel key={index} res={res} file_type={f} />;
                case "pdf":
                  return <Pdf key={index} res={res} file_type={f} />;
                case "web":
                  return <Web key={index} res={res} file_type={f} />;
              }
            })}
        </div>
      </div>
    );
  }
};
