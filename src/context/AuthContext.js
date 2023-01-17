import React, { useContext, useRef, useState, useEffect } from "react";
import { func_signup, func_signin, func_logout, useAuthStatus} from "./Functions_Auth";
import { func_snackbar} from "./Functions_1";
import { func_config, func_autoLoadPersons } from "./Functions_2";

const AuthContext = React.createContext();
export function useAuth(){return useContext(AuthContext)};

export function AuthProvider({children}){
  const reference = useRef();
  const authstatus = useAuthStatus();
  const [persons, setPersons] = useState([]);
  const [config, setConfig] = useState({auto:true});

  useEffect(()=>{
    func_config(setConfig);
    func_autoLoadPersons(persons, setPersons, func_snackbar, reference);
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
      config,
      setConfig,
    }}>
      
      {children}

    </AuthContext.Provider>
  );

};