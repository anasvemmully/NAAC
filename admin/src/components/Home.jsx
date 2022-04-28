import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import fileDownload from "js-file-download";

const Home = () => {
  return (
    <div>
      <nav className="absolute w-full flex items-center justify-between flex-wrap bg-blue-800 p-6 sm:py-6 sm:px-24">
        <div className="flex gap-2 items-center flex-shrink-0 text-white mr-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold text-xl tracking-tight">Form Builder</span>
        </div>

        <Link
          to="/fill"
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
        >
          Login
        </Link>
      </nav>
      <div className="h-screen bg-slate-100 grid place-content-center sm:py-6 sm:px-24">
        <div>
          <div>
            <h1 className="text-center font-bold text-6xl sm:text-8xl text-gray-800">
              Welcome to{" "}
              <div className="inline italic underline decoration-8 underline-offset-2">
                Form <br />
                Builder
              </div>
            </h1>
            <p className="text-center text-gray-600 font-semibold sm:border-t-2 mt-8 pt-8 px-6">
              A <span className="line-through">simple</span> form builder for
              your forms, Create your form and share it with your team
            </p>
          </div>
        </div>
      </div>
      <div className="bg-slate-200 px-6 py-8 sm:py-16 sm:px-24">
        <SortFormSearcher />
      </div>

      <footer className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
        <span className="px-5 sm:px-12 text-sm font-bold text-gray-500 sm:text-center dark:text-gray-400">
          © 2022{" "}
          <Link to="/" className="font- hover:underline">
            Form Builder™
          </Link>
          . All Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

const SortFormSearcher = () => {
  const FilterRef = React.useRef();

  const [searchList, setSearchList] = React.useState([]);
  const [KeywordList, setKeywordList] = React.useState([]);
  const [SearchTemplates, setSearchTemplates] = React.useState("");

  const [Selectedtemplate, setSelectedtemplate] = React.useState([]);

  React.useEffect(() => {
    GetTemplate();
  }, []);

  const GetTemplate = React.useCallback(() => {
    axios
      .get("/api/view/template")
      .then((res) => {
        if (res.data.success) {
          setSearchList(res.data.templates);
          setKeywordList(res.data.keywords);
          setSearchTemplates(res.data.templates);
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  }, []);

  const filterTemplate = React.useCallback(
    (ele) => {
      setSearchTemplates(
        searchList.filter((e) =>
          e.name.toLowerCase().includes(FilterRef.current.value.toLowerCase())
        )
      );
    },
    [searchList]
  );

  return (
    <div>
      <div className="rounded-lg">
        <label
          htmlFor="email-adress-icon"
          className="block mb-2 text-sm font-bold text-gray-900"
        >
          Search :
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            ref={FilterRef}
            onChange={filterTemplate}
            id="email-adress-icon"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-2/3 md:w-2/5 lg:w-1/3 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      {/* grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 */}
      <div className="mt-8 overflow-x-scroll flex gap-2 pb-6 scrollbar scrollbar-thumb-blue-500 scrollbar-track-blue-300">
        {SearchTemplates &&
          SearchTemplates.map((e, index) => {
            return (
              <div key={index} className="bg-slate-50 p-4 rounded group">
                <button
                  onClick={() => {
                    setSelectedtemplate(e);
                  }}
                  className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base "
                >
                  <span className="font-semibold text-slate-600 group-hover:text-blue-500">
                    {e.name}
                  </span>
                </button>
              </div>
            );
          })}
      </div>
      <div>
        {Selectedtemplate.length !== 0 && (
          <div className="p-1 pt-4 lg:p-4">
            <div className="font-semibold text-xl">{Selectedtemplate.name}</div>
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
              <div className="text-xs">Use filters.</div>
            </div>
          </div>
        )}
        <div className="pl-4 ">
          {Selectedtemplate.length !== 0 &&
            Selectedtemplate.layout.map((e, index) => {
              console.log(e);
              return (
                <TemplateView
                  key={index}
                  data={e}
                  index={index}
                  manageTemplate={Selectedtemplate.layout}
                  manageTemplateId={Selectedtemplate.id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

const TemplateView = ({ data, manageTemplateId, manageTemplate, index }) => {
  //   const [PopUp2, setPopUp2] = React.useState(false);

  const FileDownload = React.useCallback((file) => {
    return () => {
      axios
        .get(`/api/view/download`, {
          params: {
            id: manageTemplateId,
            file_name: file.file_name,
          },
          responseType: "blob",
        })
        .then((res) => fileDownload(res.data, file.name));
    };
  }, []);

  let style = {
    marginLeft: `${data.level * 3}rem`,
  };
  if (data.type === "section") {
    if (data.level === 0) {
      return (
        <div className="flex items-center py-1" style={style}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>{data.title}</div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center py-1" style={style}>
          <div>{data.title}</div>
        </div>
      );
    }
  } else if (data.type === "item") {
    return (
      <div className="p-3 ml-7 border mb-2 rounded" style={style}>
        <div className="mb-4">{data.title}</div>
        <div className="flex flex-nowrap gap-2 border-t border-slate-500 pt-2 overflow-x-scroll pb-4 scrollbar scrollbar-thumb-blue-500 scrollbar-track-blue-300">
          {data.data &&
            data.data.map((e, i) => {
              if (
                e.file_name.endsWith(".jpg") ||
                e.file_name.endsWith(".png") ||
                e.file_name.endsWith(".jpeg")
              ) {
                return (
                  <img
                    key={i}
                    className="w-52 h-48 rounded-md object-cover"
                    src={`/api/view/upload/${e.file_name}`}
                    alt={e.name}
                  />
                );
              } else if (
                e.file_name.endsWith("xlsx") ||
                e.file_name.endsWith("xls")
              ) {
                return (
                  <div
                    key={i}
                    tooltip={`${e.name}`}
                    className="tooltip w-52 h-48 px-8 py-16 cursor-pointer drop-shadow-2xl"
                    onClick={FileDownload(e)}
                  >
                    <svg
                      fill="#000000"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 30 30"
                      width="60px"
                      height="60px"
                    >
                      {" "}
                      <path d="M 15 3 A 2 2 0 0 0 14.599609 3.0429688 L 14.597656 3.0410156 L 4.6289062 5.0351562 L 4.6269531 5.0371094 A 2 2 0 0 0 3 7 L 3 23 A 2 2 0 0 0 4.6289062 24.964844 L 14.597656 26.958984 A 2 2 0 0 0 15 27 A 2 2 0 0 0 17 25 L 17 5 A 2 2 0 0 0 15 3 z M 19 5 L 19 8 L 21 8 L 21 10 L 19 10 L 19 12 L 21 12 L 21 14 L 19 14 L 19 16 L 21 16 L 21 18 L 19 18 L 19 20 L 21 20 L 21 22 L 19 22 L 19 25 L 25 25 C 26.105 25 27 24.105 27 23 L 27 7 C 27 5.895 26.105 5 25 5 L 19 5 z M 23 8 L 24 8 C 24.552 8 25 8.448 25 9 C 25 9.552 24.552 10 24 10 L 23 10 L 23 8 z M 6.1855469 10 L 8.5878906 10 L 9.8320312 12.990234 C 9.9330313 13.234234 10.013797 13.516891 10.091797 13.837891 L 10.125 13.837891 C 10.17 13.644891 10.258531 13.351797 10.394531 12.966797 L 11.785156 10 L 13.972656 10 L 11.359375 14.955078 L 14.050781 19.998047 L 11.716797 19.998047 L 10.212891 16.740234 C 10.155891 16.625234 10.089203 16.393266 10.033203 16.072266 L 10.011719 16.072266 C 9.9777187 16.226266 9.9105937 16.458578 9.8085938 16.767578 L 8.2949219 20 L 5.9492188 20 L 8.7324219 14.994141 L 6.1855469 10 z M 23 12 L 24 12 C 24.552 12 25 12.448 25 13 C 25 13.552 24.552 14 24 14 L 23 14 L 23 12 z M 23 16 L 24 16 C 24.552 16 25 16.448 25 17 C 25 17.552 24.552 18 24 18 L 23 18 L 23 16 z M 23 20 L 24 20 C 24.552 20 25 20.448 25 21 C 25 21.552 24.552 22 24 22 L 23 22 L 23 20 z" />
                    </svg>
                  </div>
                );
              } else if (
                e.file_name.endsWith("docx") ||
                e.file_name.endsWith("doc")
              ) {
                return (
                  <div
                    key={i}
                    tooltip={`${e.name}`}
                    className="tooltip w-52 h-48 px-8 py-16 cursor-pointer drop-shadow-2xl"
                    onClick={FileDownload(e)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="60px"
                      width="60px"
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
              } else if (e.file_name.endsWith("pdf")) {
                return (
                  <div
                    key={i}
                    tooltip={`${e.name}`}
                    className="tooltip w-52 h-48 px-8 py-16 cursor-pointer drop-shadow-2xl"
                    onClick={FileDownload(e)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="60px"
                      width="60px"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  }
};

export default Home;
