import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../context/Layout';

function EditPerson() {
    const {persons} = useAuth();
    const {state} = useLocation();

    const person = persons.reduce((accum,person)=>person.hash===state.hash?person:null,null)
    console.log(person)
  return (
    <Layout>
        <data value='/editperson'></data>
        <div style={{boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'10px'}}>
          
        <div onMouseOver={e=>e.currentTarget.style.backgroundColor='#FF7F7F'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#e0fbfc'}
          style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'#e0fbfc', cursor:'default', display:'flex', flexWrap:'nowrap', marginBottom:'10px'}}>
          <h4>Delete</h4>
        </div>



          <div>
            {person.firstname}
          </div>
          
        </div>  
    </Layout>
    
  )
}

export default EditPerson