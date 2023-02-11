import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Layout from '../context/Layout';

import InputBar from '../components/inputBar';
import Avatar from '../components/Avatar';
import {func_convertFrom24To12Format, func_stringBase64File } from './../context/Functions_1';
import { func2_toDataURL } from '../context/Functions_2';

function Addperson() {

  const { setPersons, func_snackbar, reference } = useAuth();
  const navigate = useNavigate();

  const [firstname,setFirstname] = useState('');
  const [lastname,setLastname] = useState('');
  const [email,setEmail] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [details,setDetails] = useState('');
  const [scheduleArray, setScheduleArray] = useState([]);
  const [base64Img, setBase64Img] = useState('');

  const handleTime = (e)=>{
    try{
      let id = e.currentTarget.dataset.time;
      reference.current.querySelector('#'+id).showPicker()
    }catch(err){console.log('handleTime:'+err)}
  };

  const handleAddPerson=e=>{
    try{
      e.preventDefault();
      const person = {
          hash: require("blueimp-md5")(firstname+lastname+Date.now()),
          firstname: firstname[0].toUpperCase() + firstname.slice(1,).toLocaleLowerCase(),
          lastname: lastname[0].toUpperCase() + lastname.slice(1,).toLocaleLowerCase(),
          email: email.toLowerCase(),
          base64: base64Img,
          schedule: scheduleArray.sort((a,b)=>parseFloat(a.starttime.replace(':','.'))-parseFloat(b.starttime.replace(':','.'))),
      };
      
      setPersons(prev=>[...prev, person]);

      // Clearing inputs
      reference.current.querySelector('#fname').value = '';
      reference.current.querySelector('#lname').value = '';
      reference.current.querySelector('#email').value = '';
      reference.current.querySelector('#dtails').value = '';
      setStarttime('');
      setEndtime('');
      setBase64Img('');
      setScheduleArray([]);
      setDetails('');

      // Confirmation message
      func_snackbar(reference,`${firstname} ${lastname} had bee added`);
    }catch(err){console.log('handleAddPerson: '+err)}

  };

  const handleSchedule=()=>{
    if(details===''){return func_snackbar(reference,'Details cannot be empty')};

    try{
      // putting inputs into an object item for the schedule array
      const item = {
        details: details, 
        starttime: starttime, 
        endtime: endtime, 
        date: new Date().getTime()
      };

      // Sorting the scheduleArray and adding the new item
      const sortList = [...scheduleArray, item].sort((a,b)=>parseFloat(a.starttime.replace(':','.'))-parseFloat(b.starttime.replace(':','.')));
      setScheduleArray(sortList);

      // Clear inputs from the schedule
      reference.current.querySelector('#dtails').value = '';
      reference.current.querySelector('#hddn_start_time').value = '';
      reference.current.querySelector('#hddn_end_time').value = '';
      setDetails('');
      setStarttime('');
      setEndtime('');
    }catch(err){console.log('handleSchedule:'+err)}
  };

  const handleParticipants=()=>{
    try{
      let current = reference?.current?.querySelectorAll('data')[0].value;
      let last = sessionStorage.getItem('lastpage');
      if(last!==current){sessionStorage.setItem('lastpage',current)};
      navigate('/participants');
    }catch(err){console.log('handleParticipants:'+err)}
  };

  const handleUploadPicture = e => {
    // Recieve user input and guard-clause
    let httpLink = prompt('Enter a URL address:\n(Leave empty to choose from file)');
    if(httpLink==null)return

    // Variables and Constants
    let MAX_SIZE_KB = 1000;
    let DEFAULT_PERSON_IMAGE = './../images/defaultPerson.png';

    try{

      // ======== From File =========
      if(httpLink.trim().length === 0){
        
        // Creating an input element
        let inputElem = document.createElement('input');
        inputElem.type = 'file';
        inputElem.click();

        inputElem.onchange = e => {
          
          // Callback for func_stringBase64File
          let callback = data => {

            // Set the variable to the base64 data
            setBase64Img(data);
            
          };
          func_stringBase64File(e.target, callback);
        };

      // ========= From URL =========
      }else{

        // Callback for func2_toDataURL
        let callback = data => {

          // Convert the base64 data into KB
          let size = data?.length * 6 / 8 / 1000 * 1.33;
          
          // Check if the size of the base64 is less than MAX_SIZE_KB
          if(size < MAX_SIZE_KB){

            // Set the variable to the base64 data
            setBase64Img(data);
            
          }else{
            // Notification that the image is too large
            func_snackbar(reference,`Upload must be < ${MAX_SIZE_KB/1000} MB`)
          };
        };
        // Converts the URL image into base64 data
        func2_toDataURL(httpLink, callback);
      };
      
    }catch{
      // Use default image if an error occurs anywhere
      setBase64Img(DEFAULT_PERSON_IMAGE)
    };
  };

  const handleDeleteDetailSchedule = e =>{
    // Getting the index on the item on the schedule list
    let dataIndex = e.currentTarget.dataset.index;
    
    // Getting the item's creation timestamp
    let date = scheduleArray[dataIndex].date;

    // Filtering out the current creating timestamp
    let filterArraySchedule = scheduleArray.filter(obj => obj.date !== date);
    
    // Setting new array with the filtered array
    setScheduleArray(filterArraySchedule);

    // confirmation message
    func_snackbar(reference, 'Schedule Updated')
  };

  return (
    <Layout>
      <data value='/addperson'></data>
      <div style={{display:'flex', justifyContent:'center', backgroundColor:'#ffffff', padding:'20px 0px', margin:'10px 20px', boxShadow:'1px 1px 4px 0px #8888', borderRadius:"5px", caretColor: "rgba(0,0,0,0)"}}>
        <form onSubmit={e=>handleAddPerson(e)}>
          <table width='100%'>
            <tbody>

              <tr style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', backgroundColor:'var(--sec-backgroundColor)'}}>
                <td colSpan={2}>
                  <div style={{display:'flex', alignItems:'center', padding:'5px'}}>

                    <div style={{display:'flex', justifyContent:'center', flexGrow:'1'}}>
                      <h3 style={{color:'var(--main-textColor)'}}>Information</h3>
                    </div>
                    
                    <div style={{display:'flex', alignItems:'center'}}>

                      {/* Button to add a new participant to the persons array */}
                      <input type="submit" value="Submit" onMouseOver={e=>e.currentTarget.style.backgroundColor='palegreen'} onMouseOut={e=>e.currentTarget.style.backgroundColor='lightgreen'}
                        style={{padding:'5px', fontSize:"15px", boxShadow:"1px 1px 4px 0px #8888", backgroundColor:'lightgreen', width:'100px', borderRadius:'5px'}}/>

                      {/* Button to navigate to the participant page */}
                      <button type="button" onClick={()=>handleParticipants()} style={{boxShadow:'1px 1px 4px 0px #8888', padding:'2px', marginLeft:'5px'}}>
                        <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M6.075 23.9q-1.825 0-3.113-1.288-1.287-1.287-1.287-3.112v-4.15h3.4V1.125L6.85 2.85l1.7-1.725 1.725 1.725L12 1.125l1.7 1.725 1.725-1.725 1.7 1.725 1.7-1.725L20.55 2.85l1.775-1.725V19.5q0 1.825-1.287 3.112Q19.75 23.9 17.925 23.9Zm11.85-3.4q.425 0 .713-.3.287-.3.287-.7V5.7H8.475v9.65h8.45v4.15q0 .4.287.7.288.3.713.3ZM9.4 10.05V7.8h5.475v2.25Zm0 3.175v-2.25h5.475v2.25Zm7.45-3.175q-.45 0-.788-.325-.337-.325-.337-.8 0-.45.337-.788.338-.337.788-.337.475 0 .8.337.325.338.325.788 0 .475-.325.8-.325.325-.8.325Zm0 3.175q-.45 0-.788-.325-.337-.325-.337-.8 0-.475.337-.8.338-.325.788-.325.475 0 .8.325.325.325.325.8 0 .475-.325.8-.325.325-.8.325ZM6.075 20.5h7.45v-1.75h-8.45v.75q0 .4.288.7.287.3.712.3Zm-1 0v-1.75 1.75Z"/></svg>
                      </button>
                      
                      {/* Button to navigate to add-participants-from-a-list page */}
                      <button type="button" onClick={()=>navigate('/addlist')} style={{boxShadow:'1px 1px 4px 0px #8888', padding:'2px', marginLeft:'5px'}}>
                      <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M5.25 22.15q-1.425 0-2.412-.987-.988-.988-.988-2.413V5.25q0-1.425.988-2.413.987-.987 2.412-.987h8.725v3.4H5.25v13.5h13.5v-8.725h3.4v8.725q0 1.425-.987 2.413-.988.987-2.413.987Zm2.625-4.8V15.1h8.25v2.25Zm0-3.225v-2.25h8.25v2.25Zm0-3.2v-2.25h8.25v2.25Zm9.375-1.9V6.75h-2.275V4.125h2.275V1.85h2.625v2.275h2.275V6.75h-2.275v2.275Z"/></svg>
                      </button>

                    </div>

                  </div> 
                </td>
              </tr>

              <tr style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', backgroundColor:'var(--thir-backgroundColor)'}}>
                <td>
                  <div style={{padding:"5px"}}>

                    {/* Input new participant information */}
                    <InputBar ids="fname" type={"text"} placeholder={"Lastname"} func_onChange={setLastname} required={true} />
                    <InputBar ids="lname" type={"text"} placeholder={"Firstname"} func_onChange={setFirstname} required={true} />
                    <InputBar ids="email" type={"email"} placeholder={"Email (*Optional)"} func_onChange={setEmail} required={false} />
                  
                  </div>
                </td>

                <td style={{padding:'10px'}}>
                
                {/* Upload profile picture for new participant */}
                <Avatar
                    hash='' lastname='' firstname='' base64={base64Img} func_function={e => {handleUploadPicture(e)}} />
                </td>
              </tr>

              <tr style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', backgroundColor:'var(--sec-backgroundColor)'}}>

                {/* Details input for schedule array     */}
                <td>
                  <div style={{padding:"10px"}}>
                    <InputBar ids="dtails" type={"text"} placeholder={"Details"} value={details} func_onChange={setDetails} required={false}/>
                  </div>
                </td>

                <td>
                  
                  <div style={{display:'flex', alignItems:'center', flexWrap:'nowrap'}}>

                    {/* Start-time button for the schedule array */}
                    <button data-time="hddn_start_time" onClick={e=>handleTime(e)} type="button" style={{boxShadow:'1px 1px 4px 0px #8888', padding:'2px', marginRight:'5px'}}>
                      <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M8.1 3.05V.025h7.8V3.05Zm2.4 11.975h3v-6.3h-3ZM12 24q-2.1 0-3.938-.788-1.837-.787-3.212-2.15-1.375-1.362-2.162-3.2-.788-1.837-.788-3.937 0-2.1.788-3.938.787-1.837 2.162-3.2 1.375-1.362 3.212-2.162 1.838-.8 3.938-.8 1.625 0 3.15.487 1.525.488 2.825 1.463l1.8-1.8 2.15 2.175-1.8 1.8q1.025 1.325 1.5 2.837.475 1.513.475 3.138 0 2.1-.788 3.937-.787 1.838-2.162 3.2-1.375 1.363-3.212 2.15Q14.1 24 12 24Zm0-3.4q2.8 0 4.75-1.937 1.95-1.938 1.95-4.738 0-2.775-1.95-4.738Q14.8 7.225 12 7.225T7.25 9.187Q5.3 11.15 5.3 13.925q0 2.8 1.95 4.738Q9.2 20.6 12 20.6Zm0-6.675Z"/></svg>
                      <input id="hddn_start_time" type="time" style={{display:'none'}} onChange={e=>setStarttime(e.currentTarget.value)}/>
                    </button>
                    
                    {/* End-time button for the schedule array */}
                    <button data-time="hddn_end_time" onClick={e=>handleTime(e)} type="button" style={{boxShadow:'1px 1px 4px 0px #8888',padding:'2px', marginRight:'5px'}}>
                      <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M8.1 3.05V.025h7.8V3.05Zm2.4 11.975h3v-6.3h-3ZM12 24q-2.1 0-3.938-.788-1.837-.787-3.212-2.15-1.375-1.362-2.162-3.2-.788-1.837-.788-3.937 0-2.1.788-3.938.787-1.837 2.162-3.2 1.375-1.362 3.212-2.162 1.838-.8 3.938-.8 1.625 0 3.15.487 1.525.488 2.825 1.463l1.8-1.8 2.15 2.175-1.8 1.8q1.025 1.325 1.5 2.837.475 1.513.475 3.138 0 2.1-.788 3.937-.787 1.838-2.162 3.2-1.375 1.363-3.212 2.15Q14.1 24 12 24Z"/></svg>
                      <input id="hddn_end_time" type="time" style={{display:'none'}} onChange={e=>setEndtime(e.currentTarget.value)}/>
                    </button>

                    {/* Add-to-schedule button for the schedule array */}
                    <button onClick={()=>handleSchedule()} type="button" style={{boxShadow:'1px 1px 4px 0px #8888',padding:'2px', marginRight:'5px'}}>
                      <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M10.3 19.7v-6H4.275v-3.4H10.3V4.275h3.4V10.3h6.025v3.4H13.7v6Z"/></svg>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Schedule Chart */}
          <div style={{boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'10px', display:'flex', justifyContent:'center'}}>
            <table border="1">
              <tbody>
                <tr colSpan={4}>
                  <th style={{padding:'5px'}}>DETAILS</th>
                  <th style={{padding:'5px'}}>START-TIME</th>
                  <th style={{padding:'5px'}}>END-TIME</th>
                </tr>
                {scheduleArray.map((item, i) => (
                  <tr key={i} style={{textAlign:'center'}}>
                    <th style={{color:'var(--main-textColor)', wordWrap:'breakWord'}}>{item.details}</th>
                    <td>{(!item?.starttime)?'':func_convertFrom24To12Format(item.starttime)}</td>
                    <td>{(!item?.endtime)?'':func_convertFrom24To12Format(item.endtime)}</td>
                    <td style={{cursor:'pointer'}}>
                      <svg data-index={i} onClick={e=>handleDeleteDetailSchedule(e)} height="24" width="24"><path d="m12.025 14.375-4.45 4.45q-.5.5-1.2.5t-1.2-.5q-.5-.5-.5-1.188 0-.687.5-1.187l4.45-4.475-4.45-4.45q-.5-.5-.5-1.188 0-.687.5-1.187.475-.5 1.175-.5.7 0 1.2.5L12 9.6l4.425-4.45q.5-.5 1.2-.5t1.2.5q.5.5.5 1.2t-.5 1.2L14.375 12l4.45 4.45q.5.5.5 1.2t-.5 1.175q-.475.5-1.175.5-.7 0-1.175-.5Z"/></svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default Addperson