import React from 'react';
import Layout from '../context/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import audi from '../sounds/beep-07a.mp3';


function Home() {

  const {reference} = useAuth();

  const handleAudio = ()=>{
    const audio = new Audio(audi);
    audio.play();

  }

  
  return (
    <Layout>
      <data value='/'></data>
      <div>
        test
        <input onClick={()=>handleAudio()} type='button' value='Test'/>
        <input type="text" />
        <Link to='/request'>REQUEST</Link>
        <input type="file" />
        <img src="data:image/jpeg;base64,77+9E++/ve+/vXkp77+9Oe+/ve+/vVzvv73vv73vv70=" alt='test'/>

        
        
      </div>
    </Layout>
  )
}

export default Home