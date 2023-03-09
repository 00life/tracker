import React, { useContext, useRef, useState, useEffect } from "react";
import { func_signup, func_signin, func_logout, useAuthStatus} from "./Functions_Auth";
import { func_snackbar} from "./Functions_1";
import { func_config, func2_autoLoadPersons } from "./Functions_2";
import { funcAuto_autoConfigLoad, funcAuto_load_Participants_N_Profile } from "./Functions_Autoload";


const AuthContext = React.createContext();
export function useAuth(){return useContext(AuthContext)};

export function AuthProvider({children}){
  const reference = useRef();
  const authstatus = useAuthStatus();
  const [persons, setPersons] = useState([]);
  const [logArray, setLogArray] = useState([]);
  const [config, setConfig] = useState({auto:true, rateLimit:0, timeLimit:0});
  const [outPeople, setOutPeople] = useState([]);
  const [backPeople, setBackPeople] = useState([]);
  const [profileData, setProfileData] = useState({lastname:'', firstname:'', email:'', base64:'', schedule:[], contactList:[]});
  
  const [configuration, setConfiguration] = useState({
    rateLimit:0, timeLimit:0, onceHome:0, 
    participantsWin:false, profileWin:false, 
    participantsLin:false, profileLin:false,
  });

  useEffect(()=>{
    func_config(setConfig); //fix
    func2_autoLoadPersons(persons, setPersons, func_snackbar, reference);
    
    // Offline loading of autoConfig settings
    let autoConf = funcAuto_autoConfigLoad();
    setConfiguration({
      ...configuration, 
      participantsWin:autoConf.participantsWin, profileWin:autoConf.profileWin, logWin:autoConf.logWin,
      participantsLin:autoConf.participantsLin, profileLin:autoConf.profileLin, logLin:autoConf.lowLin,
    });

    // Offline loading of Participants and Profile
    let load_P_N_P = funcAuto_load_Participants_N_Profile();
    setPersons(load_P_N_P.setPersons);
    setProfileData(load_P_N_P.setProfile);
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