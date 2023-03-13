import React, { useContext, useRef, useState, useEffect } from "react";
import { func_signup, func_signin, func_logout, useAuthStatus} from "./Functions_Auth";
import { func_snackbar} from "./Functions_1";
import { func2_config, func2_autoLoadPersons } from "./Functions_2";
import { funcAuto_localStorageAutoConfig ,funcAuto_autoConfigLoad, funcAuto_load_Participants_N_Profile, funcAuto_cleanYesterdaysRequests } from "./Functions_Autoload";
import { func3_requestNotify } from "./Functions_3";

const AuthContext = React.createContext();
export function useAuth(){return useContext(AuthContext)};

export function AuthProvider({children}){
  const reference = useRef();
  const authstatus = useAuthStatus();
  const [persons, setPersons] = useState([]);
  const [logArray, setLogArray] = useState([]);
  const [outPeople, setOutPeople] = useState([]);
  const [backPeople, setBackPeople] = useState([]);
  const [profileData, setProfileData] = useState({lastname:'', firstname:'', email:'', base64:'', schedule:[], contactList:[]});
  
  const [configuration, setConfiguration] = useState({
    onlineLoadParticipant:false, rateLimit:0, timeLimit:0,
    participantsWin:false, profileWin:false, 
    participantsLin:false, profileLin:false,
  });

  useEffect(()=>{
    // Offline loading of autoConfig settings
    let respLS = funcAuto_localStorageAutoConfig(); // Load from localStorage
    if(!respLS.resp){
      setConfiguration({
        ...configuration,
        participantsWin: respLS.obj.participantsWin, profileWin: respLS.obj.profileWin,  logWin: respLS.obj.logWin,
        participantsLin: respLS.obj.participantsLin, profileLin: respLS.obj.profileLin,  logLin: respLS.obj.logWin, 
      });
    }else{
      let obj = funcAuto_autoConfigLoad(); // Load from autoconfig.txt
      if(obj!==undefined){
        setConfiguration({
          ...configuration,
          participantsWin: obj.participantsWin, profileWin: obj.profileWin,  logWin: obj.logWin,
          participantsLin: obj.participantsLin, profileLin: obj.profileLin,  logLin: obj.logWin, 
        });
      };
    };
   
    // Offline loading of Participants and Profile
    let load_P_N_P = funcAuto_load_Participants_N_Profile(respLS.obj !== null ? respLS.obj : funcAuto_autoConfigLoad());
    if(load_P_N_P?.setPersons !== undefined){setPersons(load_P_N_P.setPersons)};
    if(load_P_N_P?.setProfile !== undefined){setProfileData(load_P_N_P.setProfile)};

    // Setting the Auto-Loading Online Participants
    func2_config(configuration, setConfiguration);
    func2_autoLoadPersons(persons, setPersons);

    // Clear all requests yesterday
    funcAuto_cleanYesterdaysRequests();

    setInterval(()=>func3_requestNotify(),2000)
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