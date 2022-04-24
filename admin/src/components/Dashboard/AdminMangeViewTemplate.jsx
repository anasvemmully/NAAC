/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../authentication/Auth";

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
          {template &&
            template.layout?.map((e, index) => (
              <TemplateViewManage
                key={index}
                data={e}
                index={index}
                id={`section-${index}`}
              />
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
    
    return (
      <div className="p-3 ml-7 border mb-2 rounded" style={style}>
        <div className="mb-4">{data.title}</div>
        <div className="flex justify-end	border-t border-slate-500	pt-2">

        </div>
      </div>
    );
  }
};
