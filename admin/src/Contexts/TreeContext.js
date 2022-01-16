import React , { createContext , useEffect ,useState} from "react";
import axios from "axios";


export const TreeContext = createContext();
export const TreeContextProvider = (props)=>{
    const [treeData , setTreeData] = useState([]);
    useEffect(()=>{
        axios.get("/api/dashboard/create")
        .then(res=>{
            setTreeData(res.data);
        })
        .catch(err=>{
            console.log(err);
       })     
    },[]);
    
    return(
        <TreeContext.Provider value={{treeData,setTreeData}}>
            {props.children}
        </TreeContext.Provider>
    );
}



