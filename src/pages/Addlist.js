import React, {useState} from 'react';
import Layout from '../context/Layout';
import { useAuth } from '../context/AuthContext';
import { func_cleanArray } from '../context/Functions_1';

function Addlist() {
  const { func_snackbar, reference, persons, setPersons} = useAuth();

  const [studentCount, setStudentCount] = useState(0)

  const handleStudentCount = e=>{
    let array = e.currentTarget.value.split('\n');
    let cleanarray = func_cleanArray(array);
    setStudentCount(cleanarray.length);
  }

  const handleSubmit=()=>{
    let elem = reference.current.querySelector('#listAddParticipants')
    let array = elem.value.split('\n');
    let cleanarray = func_cleanArray(array);
    console.log(cleanarray);
    try{
      let lastFirstNameArray = cleanarray.map(item=>[item.match('^.+? ')[0].trim(), item.match(' .+')[0].trim()]);
      lastFirstNameArray.forEach(e => {
        let person = {
          firstname:e[1],
          lastname:e[0],
          schedule:[],
          hash:require("blueimp-md5")(e[0]+e[1]),
          base64:'',
        };
        setPersons(prev=>[...prev,person]);
        localStorage.setItem('persons', JSON.stringify(persons));
      });

    }catch{
      cleanarray.forEach(e=>{
        let person = {
          firstname:'',
          lastname:e,
          schedule:[],
          hash:require("blueimp-md5")(e),
          base64:'',
        };
        setPersons(prev=>[...prev,person]);
      });
    };
      // elem.value = '';
    

    func_snackbar(reference,`${cleanarray.length} Participants have been added`)
  }

  return (
    <Layout>
        <data value='/addlist'></data>

        <div style={{display:'flex', flexDirection:"column", justifyContent:'center', width:'100%', border:'1px solid black'}}>

          <div style={{display:'flex', justifyContent:'center', flexGrow:'1'}}>
            <h3 style={{color:'#414a4c'}}>Add Participant List ({studentCount})</h3>
          </div>

          <div style={{display:'flex', justifyContent:'center', flexGrow:'1'}}>
            <h3 style={{color:'#414a4c'}}>Lastname Firstname (Middlename)</h3>
          </div>

          <div style={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', margin:'5px', flexGrow:1, padding:'10px'}}>
            
            <textarea id="listAddParticipants" placeholder="Paste Names Here..." onChange={e=>handleStudentCount(e)}
              style={{fontSize:"20px", borderRadius:'5px', outlineColor:'palegreen', padding:'5px', width:'100%', height:'50vh'}} />
            <input type="button" value="Submit" onClick={()=>handleSubmit()} style={{fontSize:"24px", padding:'5px', margin:'10px'}}/>
          
          </div>
        </div>
    </Layout>

  )
}

export default Addlist