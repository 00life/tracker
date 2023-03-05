import React, { useContext, useRef, useState, useEffect } from "react";
import { func_signup, func_signin, func_logout, useAuthStatus} from "./Functions_Auth";
import { func_snackbar} from "./Functions_1";
import { func_config, func2_autoLoadPersons } from "./Functions_2";

const AuthContext = React.createContext();
export function useAuth(){return useContext(AuthContext)};

export function AuthProvider({children}){
  const reference = useRef();
  const authstatus = useAuthStatus();
  const [persons, setPersons] = useState([]);
  const [logArray, setLogArray] = useState([]);
  const [config, setConfig] = useState({auto:true, rateLimit:0, timeLimit:0});
  const [configuration, setConfiguration] = useState({rateLimit:0, timeLimit:0});
  const [outPeople, setOutPeople] = useState([]);
  const [backPeople, setBackPeople] = useState([]);
  const [profileData, setProfileData] = useState({lastname:'', firstname:'', email:'', base64:'', schedule:[], contactList:[]});


  useEffect(()=>{
    func_config(setConfig); //fix
    func2_autoLoadPersons(persons, setPersons, func_snackbar, reference);
  },[]);
  
  return (
    <AuthContext.Provider value={{
      func_signup,
      func_signin,
      func_logout,
      func_snackbar,
      reference,
      authstatus,
      persons,
      setPersons,
      logArray,
      setLogArray,
      config,
      setConfig,
      configuration,
      setConfiguration,
      outPeople, 
      setOutPeople,
      backPeople,
      setBackPeople,
      profileData,
      setProfileData,
    }}>
      
      {children}

    </AuthContext.Provider>
  );

};