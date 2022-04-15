import React , { createContext ,useState} from "react";
// import axios from "axios";


export const TreeContext = createContext();
export const TreeContextProvider = (props)=>{
    const [treeData , setTreeData] = useState([]);
    const [templateID , settemplateID] = useState(null);
    const [templateName , settemplateName] = useState("");
 
    const [UPDATE , setUPDATE] = useState(false);


    const SET_TREE_DATA = (e)=>{
        if (UPDATE === true) {
            setTreeData(e);
        }
        else if(UPDATE === false || UPDATE === undefined){
            setTreeData(e);
            setUPDATE(true);
        }
    }
    

    //UNDER DISCUSSION
    //UNDER DISCUSSION
    //UNDER DISCUSSION
    //UNDER DISCUSSION
    //UNDER DISCUSSION
    //UNDER DISCUSSION
    //UNDER DISCUSSION
    // useEffect(()=>{
    //     axios.get("/api/dashboard/create")
    //     .then(res=>{
    //         console.log(res.data.data);
    //         // settemplateName(res.data.data.name);
    //         // setTreeData(res.data.data.layout);
    //         // settemplateID(res.data.data.id);
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //    })     
    // },[]);
    
    return(
        <TreeContext.Provider value={{ UPDATE , setUPDATE , SET_TREE_DATA , settemplateID , settemplateName , templateName , treeData , setTreeData , templateID }}>
            {props.children}
        </TreeContext.Provider>
    );
}



