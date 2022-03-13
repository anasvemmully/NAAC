import React, { useContext, useState } from "react";
import { TreeContextProvider, TreeContext } from "../../Contexts/TreeContext";
import axios from "axios";

import Popup from "../PopUp/popup.jsx";
// import  {useNavigate} from 'react-router-dom';

const Node = ({ index, title, type, parent, level, settree }) => {
  const { treeData, setTreeData } = useContext(TreeContext);
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
    setTreeData([
      ...treeData.slice(0, i),
      {
        title: "",
        type: "item",
        parent: index,
        level: level + 1,
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
    setTreeData([...treeData.slice(0, index), ...treeData.slice(i)]);
  };

  return (
    <div className="container my-4" style={settree ? style : {}}>
      <div className="flex space-x-4">
        <input
          disabled
          className="placeholder:italic placeholder:text-gray-400 bg-white border border-gray-300 rounded-sm py-2 px-3 w-2/5 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
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
            data={{ index, title, type, parent, level }}
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
// Node Older version
// eslint-disable-next-line no-lone-blocks
{
  /* <div className='container my-4' style={settree?style:{}}>
          <div className='flex space-x-4'>
            <input className='placeholder:italic placeholder:text-gray-400 bg-white border border-gray-300 rounded-sm py-2 px-3 w-2/5 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm' value={treeData[index].title} onChange={(e)=>{
              treeData[index].title = e.target.value;
              setTreeData([...treeData])
              }}/>
              {type==='section'?(<button onClick={addChild}>
                <svg className='h-6 w-6 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z' clipRule='evenodd'></path></svg>
              </button>):""}
              <button onClick={smartDelete}><svg className='h-6 w-6 text-red-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd'></path></svg>
              </button>
          </div>            
        </div> */
}

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

const TreeUpload = () => {
  const { treeData, setTreeData, templateID, templateName } =
    useContext(TreeContext);
  return (
    <div className="flex space-x-4 mt-8">
      <div>
        <button
          className="font-semibold rounded-md bg-red-500 text-white px-3 py-2"
          onClick={() => {
            setTreeData([
              ...treeData,
              {
                title: "Placeholder",
                type: "section",
                parent: null,
                level: 0,
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
            // console.log(ref.current);
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
    </div>
  );
};

export const Tree = (props) => {
  return (
    <TreeContextProvider>
      <div className="">
        <App />
        <TreeUpload />
      </div>
    </TreeContextProvider>
  );
};
