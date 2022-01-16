import React , { useContext , useState  } from 'react';
import { TreeContextProvider , TreeContext } from '../../Contexts/TreeContext';
import axios from "axios";
// import  {useNavigate} from 'react-router-dom';


const TreeUpload = ()=>{
  const {treeData,setTreeData} = useContext(TreeContext);
  return(
    <div className='flex space-x-4 mt-8'>
            <div>
                <button className='font-semibold rounded-md bg-red-500 text-white px-3 py-2' onClick={()=>{
                  setTreeData([...treeData,{
                    title:"Placeholder",
                    type:"section",
                    parent:null,
                    level:0,
                    children:false
                  }])
                }}>Add</button>
            </div>
            <div>
                <button className='font-semibold rounded-md bg-red-500 text-white px-3 py-2' onClick={()=>{
                  axios.post("/api/data",{
                    layout : treeData
                  });        
                  // console.log(ref.current);
                }}>Upload</button>
            </div>
        </div>
    )
  }
  
const Node = ({index,title,type,parent,level,children,settree})=>{
    const {treeData,setTreeData} = useContext(TreeContext);
    const style = {
        paddingLeft:`${level*3}rem`
    }
    const addChild = ()=>{
      var i=index+1;
      for(i;i<treeData.length;i++){
        if(treeData[i].level<level || treeData[i].level === level ){
          break;
        }
      }
      setTreeData([
        ...treeData.slice(0,i),
        {
        title:"Placeholder",
        type:"section",
        parent:index,
        level:level+1,
        children:false
        },
        ...treeData.slice(i)])
    }
    const smartDelete = ()=>{
      var i=index+1;
      for(i;i<treeData.length;i++){
        if(treeData[i].level === level){
          break;
        }
      }
      setTreeData([
        ...treeData.slice(0,index),
        ...treeData.slice(i)])
    }
    return(
        <div className='container my-4' style={settree?style:{}}>
          <div className='flex space-x-4'>
            <input className='placeholder:italic placeholder:text-gray-400 bg-white border border-gray-300 rounded-md py-2 px-3 w-2/5 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm' value={treeData[index].title} onChange={(e)=>{
              treeData[index].title = e.target.value;
              setTreeData([...treeData])
              }}/>
              {type==='section'?(<button onClick={addChild}>
                <svg className='h-6 w-6 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z' clipRule='evenodd'></path></svg>
              </button>):""}
              <button onClick={smartDelete}><svg className='h-6 w-6 text-red-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd'></path></svg>
              </button>
          </div>            
        </div>
    );
}

const App = (props)=>{

  const {treeData} = useContext(TreeContext); 
  const [settree , settreeSet] = useState(true);
  return(
    <>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={()=>{
        settreeSet(!settree);
      }}>Toggle Tree View</button>
      {treeData.length && treeData.map((item,index)=>{
        return(
          <Node key={index} {...item} settree={settree} index={index}/>
        )
      })}
    </>
  )
}

export const Tree = (props) => {
    return (
        <TreeContextProvider>
            <div className='m-8'>
                <App/>
                <TreeUpload/>
            </div>
        </TreeContextProvider>
    );
};