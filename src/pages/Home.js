import React, { useEffect } from 'react';
import Layout from '../context/Layout';
import { useAuth } from '../context/AuthContext';
import { funcAuth_loadData } from '../context/Functions_Auth';


function Home() {

  const {reference } = useAuth();

  useEffect(()=>{
    try {
      let callback = (data) => {
        const elem = reference.current.querySelector('#Home_insertHTML');
        elem.innerHTML = data.news ?? '';
      };
      funcAuth_loadData('/NewForEveryone', callback);
    } catch (err) { console.log('useEffect: ' + err) }
  },[reference]);


  return (
    <Layout>
      <data value='/'></data>
      <div id="Home_insertHTML"></div>
    </Layout>
  );
};

export default Home