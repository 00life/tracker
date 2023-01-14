import React, { useContext, useRef, useState } from "react";

const AuthContext = React.createContext();
export function useAuth(){return useContext(AuthContext)};

export function AuthProvider({children}){
   const [test, setTest] = useState('This is a test')

    return (
        <AuthContext.Provider value={{
            test
        }}>
          
          {children}
    
        </AuthContext.Provider>
    );
    
};