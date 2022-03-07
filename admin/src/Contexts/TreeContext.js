import React , { createContext , useEffect ,useState} from "react";
import axios from "axios";


export const TreeContext = createContext();
export const TreeContextProvider = (props)=>{
    const [treeData , setTreeData] = useState([]);
    const [templateID , settemplateID] = useState(null);
    useEffect(()=>{
        axios.get("/api/dashboard/create")
        .then(res=>{
            setTreeData(res.data.data);
            settemplateID(res.data.templateID);
        })
        .catch(err=>{
            console.log(err);
       })     
    },[]);
    
    return(
        <TreeContext.Provider value={{treeData,setTreeData,templateID}}>
            {props.children}
        </TreeContext.Provider>
    );
}



