import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../context/Layout';

import InputBar from "../components/inputBar";
import Avatar from '../components/Avatar';
import { func_convertFrom24To12Format, func_stringBase64File, func_savedata, func_loaddata } from '../context/Functions_1';
import { func2_toDataURL, func2_stringDateName } from '../context/Functions_2';


function Profile() {//fix
  const { func_snackbar, profileData, setProfileData, reference } = useAuth();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [details, setDetails] = useState('');
  const [onSchedule, setOnSchedule] = useState([]);

  useEffect(()=>{
    reference.current.querySelector('#profile_fname').value = profileData.firstname;
    reference.current.querySelector('#profile_lname').value = profileData.lastname;
    reference.current.querySelector('#profile_email').value = profileData.email;
    setFirstname(profileData.firstname);
    setLastname(profileData.lastname);
    setEmail(profileData.email);
    setOnSchedule([...profileData.schedule]);
  },[reference, profileData])


  const handleTime = e => {
    // Clicking on the time-picker
    let ids = e.currentTarget.dataset.time;
    e.currentTarget.querySelector('#'+ids).showPicker();
  };

  const handleSchedule = e => {
    // Guard-Claus if details is empty
    if(details === '' || details === null || details === undefined){
      func_snackbar(reference, 'Details must not be empty');
      return
    };

    // Add to list array of objects
    let obj = {
      details: details.trim(), 
      starttime: starttime, 
      endtime: endtime,
      date: new Date().getTime(),
    };

    const sortList = [...onSchedule, obj].sort((a,b)=>parseFloat(a.starttime.replace(':','.'))-parseFloat(b.starttime.replace(':','.')));
    setOnSchedule(sortList);

    // Clear inputs and confirmation message
    reference.current.querySelector('#profile_hddn_start_time').value = '';
    reference.current.querySelector('#profile_hddn_end_time').value = '';
    reference.current.querySelector('#profile_dtails').value = '';
  };

  const handleDeleteDetailSchedule = e => {
    // Getting the index on the item on the schedule list
    let dataIndex = e.currentTarget.dataset.index;
      
    // Getting the item's creation timestamp
    let date = onSchedule[dataIndex].date;
  
    // Filtering out the current creating timestamp
    let filterArraySchedule = onSchedule.filter(obj => obj.date !== date);
    
    // Setting new array with the filtered array
    setOnSchedule(filterArraySchedule);

    // Confirmation message
    func_snackbar(reference, 'Schedule Updated');
  };

  const handleUploadPicture = e => {
    // Recieve user input and guard-clause
    let httpLink = prompt('Enter a URL address:\n(Leave empty to choose from file)');
    if(httpLink==null)return

    // Variables and Constants
    let MAX_SIZE_KB = 1000;

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
            setProfileData({...profileData, base64:data});
            
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
            setProfileData({...profileData, base64:data});
            
          }else{
            // Notification that the image is too large
            func_snackbar(reference,`Upload must be < ${MAX_SIZE_KB/1000} MB`)
          };
        };
        // Converts the URL image into base64 data
        func2_toDataURL(httpLink, callback);
      };
      
    }catch(err){console.log('handleUploadPicture: ' + err)};
  };

  const handleSaveProfile = ()=>{
    try{
      // Updating profileData object
      setProfileData({...profileData, firstname:firstname, lastname:lastname, email:email, schedule:onSchedule});

      // Creating the object to save to file
      let profileObj = {
        firstname: firstname !=='' ? firstname : profileData.firstname,
        lastname: lastname !=='' ? lastname : profileData.lastname,
        email: email !=='' ? email : profileData.email,
        schedule: onSchedule !==[] ? onSchedule : profileData.schedule,
        base64: profileData.base64,
        
      };

      // Generating the name of the file
      let saveStringName = `profile_${func2_stringDateName()}.json`;
      
      // Saving the file to the computer
      func_savedata(profileObj, saveStringName);
    }catch(err){console.log('handleSaveProfile: ' + err)}
  };

  const handleLoadProfile = () => {
    try{
      // Generating the input element and clicking on it 
      let elem = document.createElement('input');
      elem.setAttribute('type','file');
      elem.click()
      elem.onchange = e =>{

        // Loading the data to setProfilData object
        let callback = data => {
          setProfileData({...profileData,
            firstname:data.firstname,
            lastname:data.lastname,
            email:data.email,
            base64:data.base64,
            schedule:data.schedule,
          });
        };
        func_loaddata(e.currentTarget, callback)
      };
    }catch(err){console.log('handleLoadProfile: ' + err)}
  };


  return (
    <Layout>
      <data value='/profile'></data>
      <div style={{display:'flex', justifyContent:'center', backgroundColor:'#ffffff', padding:'20px 0px', margin:'10px 20px', boxShadow:'1px 1px 4px 0px #8888', borderRadius:"5px", caretColor: "rgba(0,0,0,0)"}}>
        <form>
          <table width='100%'>
            <tbody>

              <tr style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', backgroundColor:'var(--sec-backgroundColor)'}}>
                <td colSpan={2}>
                  <div style={{display:'flex', alignItems:'center', padding:'5px'}}>

                    <div style={{display:'flex', justifyContent:'center', flexGrow:'1'}}>
                      <h3 style={{color:'var(--main-textColor)'}}>My Profile</h3>
                    </div>
                    
                    <div style={{display:'flex', alignItems:'center'}}>
                      
                      {/* Save Profile Button */}
                      <div onClick={()=>handleSaveProfile()} onMouseOver={e=>e.currentTarget.style.backgroundColor='palegreen'} onMouseOut={e=>e.currentTarget.style.backgroundColor='lightgreen'}
                        style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'lightgreen', cursor:'default', display:'flex', flexWrap:'nowrap', width:'50%'}}>
                        <h4 className="textDesign1" style={{ margin:'auto', color:'white', fontSize:'20px'}}>Save</h4>
                        <svg style={{filter:'drop-shadow(2px 2px 1px #8888)', margin:'0 5px'}} height="24" width="24"><path d="M22.15 6.525V18.75q0 1.425-.987 2.413-.988.987-2.413.987H5.25q-1.425 0-2.412-.987-.988-.988-.988-2.413V5.25q0-1.425.988-2.413.987-.987 2.412-.987h12.225Zm-3.4 1.425-2.7-2.7H5.25v13.5h13.5ZM12 17.825q1.3 0 2.213-.912.912-.913.912-2.213t-.912-2.213q-.913-.912-2.213-.912t-2.212.912q-.913.913-.913 2.213t.913 2.213q.912.912 2.212.912Zm-5.825-7.4h9.3v-4.25h-9.3ZM5.25 7.95v10.8-13.5Z"/></svg>
                      </div>

                      {/* Load Profile Button */}
                      <div onClick={()=>handleLoadProfile()} onMouseOver={e=>e.currentTarget.style.backgroundColor='lightblue'} onMouseOut={e=>e.currentTarget.style.backgroundColor='skyblue'}
                        style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'skyblue', cursor:'default', display:'flex', flexWrap:'nowrap', width:'50%'}}>
                        <h4 className="textDesign1" style={{ margin:'auto', color:'white', fontSize:'20px'}}>Load</h4>
                        <svg style={{filter:'drop-shadow(2px 2px 1px #8888)', margin:'0 5px'}} height="24" width="24"><path d="M10.875 19.1H13.1v-4.35l1.6 1.6 1.525-1.525-4.25-4.25-4.25 4.25 1.55 1.525 1.6-1.6ZM6.25 23.15q-1.4 0-2.4-.987-1-.988-1-2.413V4.25q0-1.425 1-2.413 1-.987 2.4-.987h7.975l6.925 6.875V19.75q0 1.425-1 2.413-1 .987-2.4.987ZM12.475 9.5V4.25H6.25v15.5h11.5V9.5ZM6.25 4.25V9.5 4.25v15.5-15.5Z"/></svg>
                      </div>

                    </div>

                  </div> 
                </td>
              </tr>

              <tr style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', backgroundColor:'var(--thir-backgroundColor)'}}>
                <td>
                  <div style={{padding:"5px"}}>

                    {/* Input new participant information */}
                    <InputBar ids="profile_lname" type={"text"} placeholder='Lastname' func_onChange={setLastname} required={true} />
                    <InputBar ids="profile_fname" type={"text"} placeholder='Firstname' func_onChange={setFirstname} required={true} />
                    <InputBar ids="profile_email" type={"email"} placeholder='Email (*Optional)' func_onChange={setEmail} required={false} />
                  </div>
                </td>

                <td style={{padding:'10px'}}>
                
                {/* Upload profile picture for new participant */}
                <Avatar
                    hash='' lastname='' firstname='' base64={profileData.base64} func_function={e => {handleUploadPicture(e)}} />
                </td>
              </tr>

              <tr style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', backgroundColor:'var(--sec-backgroundColor)'}}>

                {/* Details input for schedule array     */}
                <td>
                  <div style={{padding:"10px"}}>
                    <InputBar ids="profile_dtails" type={"text"} placeholder={"Details"} value={details} func_onChange={setDetails} required={false}/>
                  </div>
                </td>

                <td>
                  
                  <div style={{display:'flex', alignItems:'center', flexWrap:'nowrap'}}>

                    {/* Start-time button for the schedule array */}
                    <button data-time="profile_hddn_start_time" onClick={e=>handleTime(e)} type="button" style={{boxShadow:'1px 1px 4px 0px #8888', padding:'2px', marginRight:'5px'}}>
                      <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M8.1 3.05V.025h7.8V3.05Zm2.4 11.975h3v-6.3h-3ZM12 24q-2.1 0-3.938-.788-1.837-.787-3.212-2.15-1.375-1.362-2.162-3.2-.788-1.837-.788-3.937 0-2.1.788-3.938.787-1.837 2.162-3.2 1.375-1.362 3.212-2.162 1.838-.8 3.938-.8 1.625 0 3.15.487 1.525.488 2.825 1.463l1.8-1.8 2.15 2.175-1.8 1.8q1.025 1.325 1.5 2.837.475 1.513.475 3.138 0 2.1-.788 3.937-.787 1.838-2.162 3.2-1.375 1.363-3.212 2.15Q14.1 24 12 24Zm0-3.4q2.8 0 4.75-1.937 1.95-1.938 1.95-4.738 0-2.775-1.95-4.738Q14.8 7.225 12 7.225T7.25 9.187Q5.3 11.15 5.3 13.925q0 2.8 1.95 4.738Q9.2 20.6 12 20.6Zm0-6.675Z"/></svg>
                      <input id="profile_hddn_start_time" type="time" style={{display:'none'}} onChange={e=>setStarttime(e.currentTarget.value)}/>
                    </button>
                    
                    {/* End-time button for the schedule array */}
                    <button data-time="profile_hddn_end_time" onClick={e=>handleTime(e)} type="button" style={{boxShadow:'1px 1px 4px 0px #8888',padding:'2px', marginRight:'5px'}}>
                      <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M8.1 3.05V.025h7.8V3.05Zm2.4 11.975h3v-6.3h-3ZM12 24q-2.1 0-3.938-.788-1.837-.787-3.212-2.15-1.375-1.362-2.162-3.2-.788-1.837-.788-3.937 0-2.1.788-3.938.787-1.837 2.162-3.2 1.375-1.362 3.212-2.162 1.838-.8 3.938-.8 1.625 0 3.15.487 1.525.488 2.825 1.463l1.8-1.8 2.15 2.175-1.8 1.8q1.025 1.325 1.5 2.837.475 1.513.475 3.138 0 2.1-.788 3.937-.787 1.838-2.162 3.2-1.375 1.363-3.212 2.15Q14.1 24 12 24Z"/></svg>
                      <input id="profile_hddn_end_time" type="time" style={{display:'none'}} onChange={e=>setEndtime(e.currentTarget.value)}/>
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
                {onSchedule.map((obj, i) => (
                  <tr key={i} style={{textAlign:'center'}}>
                    <th style={{color:'var(--main-textColor)', wordWrap:'breakWord'}}>{obj.details}</th>
                    <td>{(!obj?.starttime)?'':func_convertFrom24To12Format(obj.starttime)}</td>
                    <td>{(!obj?.endtime)?'':func_convertFrom24To12Format(obj.endtime)}</td>
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

export default Profile