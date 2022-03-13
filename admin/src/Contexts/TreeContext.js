import React , { createContext , useEffect ,useState} from "react";
import axios from "axios";


export const TreeContext = createContext();
export const TreeContextProvider = (props)=>{
    const [treeData , setTreeData] = useState([]);
    const [templateID , settemplateID] = useState(null);
    const [templateName , settemplateName] = useState("");
    useEffect(()=>{
        axios.get("/api/dashboard/create")
        .then(res=>{
            console.log(res.data.data);
            settemplateName(res.data.data.name);
            setTreeData(res.data.data.layout);
            settemplateID(res.data.data.id);   
        })
        .catch(err=>{
            console.log(err);
       })     
    },[]);
    
    return(
        <TreeContext.Provider value={{settemplateName,templateName, treeData,setTreeData,templateID}}>
            {props.children}
        </TreeContext.Provider>
    );
}



