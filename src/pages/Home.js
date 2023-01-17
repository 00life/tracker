import React from 'react';
import Layout from '../context/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Home() {

  const {reference} = useAuth();

  const func_qrcode = ()=>{
    // let QRCode = require('qrcode');
    // let canvas = reference.current.querySelector('#qrtest');

    // QRCode.toCanvas(canvas, 'sample text', function (error) {
    //   if (error) console.error(error)
    //   console.log('success!');
    // })

  };

  
  return (
    <Layout>
      <data value='/'></data>
      <div>
        test
        <input onClick={()=>func_qrcode()} type='button' value='Test'/>
        <input type="text" />
        <Link to='/request'>REQUEST</Link>
        <input type="file" />
        <img src="data:image/jpeg;base64,77+9E++/ve+/vXkp77+9Oe+/ve+/vVzvv73vv73vv70=" alt='test'/>

        
        
      </div>
    </Layout>
  )
}

export default Home