import React from 'react';
import { useAuth } from '../context/AuthContext';


function Home() {

  const {test} = useAuth();
  
  return (
      
    <div>
      {test}
    </div>
    
  )
}

export default Home