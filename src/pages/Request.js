import React, { useState, useEffect } from 'react';
import { auth } from "../context/Firebase";
import { useAuth } from '../context/AuthContext';
import Layout from '../context/Layout';
import InputBar from '../components/inputBar';
import ToggleBtn from '../components/ToggleBtn';
import ModalView from '../components/ModalView';
import {funcAuth_loadKeyData, funcAuth_loadValData} from '../context/Functions_Auth';
import { func_modalview } from '../context/Functions_1';
import RequestOptions from './RequestOptions';
import ReceivingParticipant from '../components/ReceivingParticipant';
import SentParticipant from '../components/SentParticipant';
import TakeReceivingParticipant from '../components/TakeSentParticipant';
import TakeSentParticipant from '../components/TakeReceiveParticipant';


function Request() {

  const { profileData, setProfileData, reference } = useAuth();

  const [toggleButton, setToggleButton] = useState(false);
  const [uidEmailArray, setUidEmailArray] = useState([]);
  const [filterEmails, setFilterEmails] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [allConfirms, setAllConfirms] = useState([]);
  const [counter, setCounter] = useState(0);


  const handleSearchToggle = e => {
    try{
      // Switch the toggle button
      setToggleButton(!toggleButton);
      
      // Get an array of users of the app
      let uidArrayPromise = new Promise(resolve=>{
        if(e.currentTarget.checked){
          let callback = data =>{
            resolve(data);
          } ;; // Callback Host
          funcAuth_loadKeyData('/users', callback);
        };
      });

      // Get an array of objects with UID and Email
      let uidEmailPromise = data => {
        return new Promise(resolve=>{
          
          let uidEmailArray = [];
        
          for(let i=0; i < data.length; i++){
            let path = `/users/${data[i]}/profile/email`;
            let callback2 = data2 => {
              let mydata = (data2 === undefined||data2 === null||data2 === '') ? '' : data2;
              uidEmailArray.push({email:mydata.join(''), uid:data[i]});
            } ;; // Callback2 Host
            funcAuth_loadValData(path, callback2)
          };
          // return the results
          resolve(uidEmailArray);
        })
      };

      // Calling the Promise / Functions
      (async()=>{
        let uidArray = await uidArrayPromise;
        setUidEmailArray([...await uidEmailPromise(uidArray)]);
      })();
      
    }catch(err){console.log('handleSearchToggle: ' + err)}
  };
 

  const handleContactSearch = e =>{
    try{
      // Put lower case and remove whitespaces
      let lowercase = e.toLowerCase();
      let cleanLetter = lowercase.replace(/[^\w\s]/gi, '');

      if(e===''){
        setFilterEmails([]);
      }else{
        let filterArray = uidEmailArray.filter(obj=>obj.email.match('^'+cleanLetter));
        let excludeArray = filterArray.filter(obj=>obj.uid !== auth.currentUser.uid);
        setFilterEmails([...excludeArray]);
      }
    }catch(err){console.log('handleContactSearch: ' + err)};
  };

  const handleAddContact = () => {
    try{

      // Nodelist of checkbox elements
      let checkboxArray = reference.current.querySelectorAll('.checkbox_contact');
      
      // Adding checked checkbox data to contactArray
      let contactArray = [];
      for(let i=0; i < checkboxArray.length;i++){
        if(checkboxArray[i].checked){
          let selectUid = String(checkboxArray[i].id.slice(9,));
          let selectEmail = String(checkboxArray[i].dataset.email);
          contactArray.push({email: selectEmail, uid: selectUid, contactName: selectEmail});
        };
      };

      // Ensuring that there are not repeats in selectArray (all unique)
      let selectSet = new Set();
      profileData.contactList.forEach(obj=>selectSet.add(JSON.stringify(obj)));
      contactArray.forEach(obj=>selectSet.add(JSON.stringify(obj)));
      let selectArray = Array.from(selectSet).map(obj=>(JSON.parse(obj)));
      
      // Adding selectArray to the profileData
      setProfileData({...profileData, contactList:[...selectArray]})

    }catch(err){console.log('handleAddContact: ' + err)}
  };

  const handleContactOptions = e => {
    let selectUid = e.currentTarget.dataset.uid;
    let contactName = e.currentTarget.innerHTML

    let elem_requestOptions_rename = reference.current.querySelector('#requestOptions_rename');
    let elem_requestOptions_delete = reference.current.querySelector('#requestOptions_delete');

    elem_requestOptions_delete.dataset.uid = selectUid;
    elem_requestOptions_rename.placeholder = contactName;
    elem_requestOptions_rename.setAttribute('data-uid', selectUid);

    func_modalview(reference, '#myModal');
  };

  const handleCheckbox = e => {
    try{
      let selectUid = e.currentTarget.id.slice(9,);
      let elem = reference.current.querySelector('#label_' + selectUid);

      // Change backgroundColor when element is checked
      (e.currentTarget.checked)
        ? elem.style.backgroundColor = 'var(--columbianBlue)'
        : elem.style.backgroundColor = 'var(--monochromaticWhite)';
    }catch(err){console.log('handleCheckbox: ' + err)};
  };

  const handleRefresh = e =>{
    setCounter(counter+1);
  };

  useEffect(()=>{
    
    let callback = data =>{
      let allReqArray = [];
      let confirmReqArray = [];

      // Sorting the data into respective Arrays
      data.forEach(obj=>{
        if(obj.type === 'receive' || obj.type === 'sent' || obj.type === 'take_sent' || obj.type === 'take_receive'){
          allReqArray.push(obj);
        }else if(obj.type === 'confirm'){
          confirmReqArray.push(obj)
        };

      });
      setAllRequests([...allReqArray]);
      setAllConfirms([...confirmReqArray]);
    } ;; // Callback Host
    funcAuth_loadValData(`users/${auth.currentUser.uid}/requests`, callback);

  },[counter])

  return (
    <Layout>
      <data value='/request'></data>
      <div style={{height:'100%', display:'flex', flexDirection:'column'}}>

        <ModalView ids={"myModal"} styles={{ display: 'none' }} header={'Request Options'}>
          <RequestOptions />
        </ModalView>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:"1px 1px 4px 0px #8888", margin:'5px', padding:'3px 10px', borderRadius:'5px', backgroundColor:'var(--sec-backgroundColor)'}}>
          
          {/* Title: Search Email Contacts */}
          <h3 style={{color:'var(--main-textColor)'}}>Search Email Contacts</h3>

          {/* Search Toggle Button   */}
          <ToggleBtn func_onToggle={handleSearchToggle} check={toggleButton}/>
  
        </div>

        {toggleButton && 
          <div style={{display:'flex', boxShadow:"1px 1px 4px 0px #8888", margin:'5px', borderRadius:'5px', padding:'5px', alignContent:'center'}}>
            
            {/* Contact Search-bar Input */}
            <div style={{flexGrow:1, position:'relative'}}>
              <InputBar placeholder='Search contact by email' func_onChange={handleContactSearch}/>
            </div>
            
            {/* Add Contact Button */}
            <div onClick={()=>handleAddContact()} onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--tetradicGreen)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--analogousGreen)'}
              style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', border:'2px solid black', backgroundColor:'var(--analogousGreen)', display:'flex', alignItems:'center', width:'5rem', margin:'5px', cursor:'pointer'}}>
              <h4 className="textDesign1" style={{ margin:'auto', color:'var(--thir-backgroundColor)', fontSize:'20px'}}>Add</h4>
            </div>

            

          </div>
        }

        {toggleButton &&
          <div style={{boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', display:'flex', alignItems:'center', margin:'0px 5px 5px 5px', padding:'5px'}}>
            
            {/* List of Email Contacts that Match */}
            {filterEmails.map((obj,i)=>(
              
              <div key={i} style={{padding:'5px'}}>

                {/* Contact Search Result Email */}
                <label id={'label_'+obj.uid} htmlFor={'checkbox_'+obj.uid}
                  style={{cursor:'pointer', boxShadow:"1px 1px 4px 0px #8888", backgroundColor:'var(--monochromaticWhite)', padding:'5px', borderRadius:'5px', border:'1px solid blue', margin:'5px'}}>
                  {obj.email}  
                </label>

                {/* Contact Search Item Hidden Checkbox */}
                <input className="checkbox_contact" data-email={obj.email} id={'checkbox_'+obj.uid} type='checkbox' onChange={e=>handleCheckbox(e)} style={{display:'none'}}/>
             
              </div>

            ))}

          </div>
        }

        <div style={{display:'flex', flexGrow:1, marginBottom:'35px'}}>
          
          <div style={{boxShadow:'1px 1px 4px 0px #8888', margin:'0 2px 0 5px', padding:'5px', width:'25%', borderRadius:'5px', height:'100%'}}>
          
            {/* Contact Title */}
            <h4 style={{color:'var(--main-textColor)', width:'fit-content', margin:'auto'}}>Contacts</h4>
            
            <hr/>

            {/* List of Saved Contacts */}
            {profileData.contactList.map((obj,i)=>(

              <div key={i}>
              
                  <div data-uid={obj.uid} onClick={e=>handleContactOptions(e)}
                    style={{border:'1px solid #8888', borderRadius:'5px', margin:'2px', overflow:'clip', cursor:'pointer',padding:'7px', backgroundColor: (i%2===0)?'':'var(--thir-backgroundColor)'}}>
                    {obj.contactName}
                  </div>
              
              </div>
              
              ))}

          </div>
          
          <div style={{boxShadow:'1px 1px 4px 0px #8888', margin:'0 5px 0 2px', padding:'5px', width:'75%', borderRadius:'5px'}}>
            
            {/* Log-List Title  */}
            <div style={{display:'flex', alignItems:'center', width:'fit-content', margin:'auto'}}>
              <h4 style={{color:'var(--main-textColor)'}}>Requests</h4>
              <svg height="20" viewBox="0 96 960 960" width="20" onClick={e=>handleRefresh(e)}
                style={{filter:'drop-shadow(2px 2px 1px #8888)', cursor:'pointer'}}><path d="M439 959q-123-18-208-110.5T146 628q0-63 21-118t57-102l91 90q-18 27-29.5 61T274 628q0 76 47.5 131T439 829v130Zm82 0V829q72-13 118.5-69T686 628q0-79-51.5-138T506 423h-10l47 47-69 69-186-187 186-188 69 70-60 60h10q134 0 227.5 98.5T814 628q0 129-84.5 221.5T521 959Z"/></svg>
            </div>

            <hr/>
            
            {/* Log-List of Requests */}
            {allRequests.map((obj,i)=>(
              <div key={i}>

                {auth.currentUser.uid !== obj.sender && obj.type === 'receive' &&
                  <ReceivingParticipant firstname={obj.firstname} lastname={obj.lastname} timestamp={obj.timestamp} sender={obj.sender} confirm={allConfirms} hash={obj.hash} schedule={obj.schedule} email={obj.email} base64={obj.base64} arriveTime={obj.arriveTime} leaveTime={obj.leaveTime} senderName={obj.senderName}/>
                }

                {auth.currentUser.uid === obj.sender && obj.type === 'sent' &&
                  <SentParticipant firstname={obj.firstname} lastname={obj.lastname} timestamp={obj.timestamp} confirm={allConfirms} arriveTime={obj.arriveTime} leaveTime={obj.leaveTime} receiverName={obj.receiverName} />
                }

                {auth.currentUser.uid === obj.sender && obj.type === 'take_sent' &&
                  <TakeSentParticipant firstname={obj.firstname} lastname={obj.lastname} timestamp={obj.timestamp} confirm={allConfirms} arriveTime={obj.arriveTime} leaveTime={obj.leaveTime}/>
                }

                {auth.currentUser.uid !== obj.sender && obj.type === 'take_receive' &&
                  <TakeReceivingParticipant firstname={obj.firstname} lastname={obj.lastname} timestamp={obj.timestamp} confirm={allConfirms} arriveTime={obj.arriveTime} leaveTime={obj.leaveTime}/>
                }
                
              </div>
            ))}
          </div>

        </div>
    
      </div>
    </Layout>
  )
}

export default Request