import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import InputBar from "../components/inputBar";
import Avatar from "../components/Avatar";
import { funcAuth_updateData } from '../context/Functions_Auth';
import { auth } from "../context/Firebase";


function RequestOptions(){

    const { persons, profileData, setProfileData, reference } = useAuth();
    const [searchResults, setSearchResults] = useState([]);

    const handleParticipantSearch = e =>{
        try{
            let lowercase = e.toLowerCase();
            let cleanLetter = lowercase.replace(/[^\w\s]/gi, '')
            
            if(cleanLetter === ''){
                setSearchResults([])
            }else{
                let filterFirstnameArray = persons.filter(item=>item.firstname.toLowerCase().match('^'+cleanLetter));
                let filterLastnameArray = persons.filter(item=>item.lastname.toLowerCase().match('^'+cleanLetter));
                let filterFinal = [...new Set([...filterFirstnameArray,...filterLastnameArray])];
                setSearchResults([...filterFinal]);
            };

        }catch(err){console.log('handleParticipantSearch: ' + err)};
    };

    const handleCheckbox = e => {
        try{
            let selectHash = String(e.currentTarget.id.slice(8,));
            let elem = reference.current.querySelector('#avatar_'+selectHash);
           
            (e.currentTarget.checked)
                ? elem.parentNode.style.boxShadow = '0 0 0 7px var(--tetradicGreen)'
                : elem.parentNode.style.boxShadow = '0 0 0 5px var(--columbianBlue)';
        }catch(err){console.log('handleCheckbox: ' + err)};
    };

    const handleDeleteContact = e => {
        try{
            let selectUid = e.currentTarget.dataset.uid;
            let filterProfileData = profileData.contactList.filter(obj=>(obj.uid !== selectUid));
            setProfileData({...profileData, contactList:[...filterProfileData]});
        }catch(err){console.log('handleDeleteContact: ' + err)}
    };

    const handleRename = () => {
        try{
            // Get the element of the rename input
            let elem = reference.current.querySelector('#requestOptions_rename');
            // Getting the object from profileData with provided uid
            let objContact = profileData.contactList.filter(obj=>(obj.uid === elem.dataset.uid))[0];

            // Changing the object's contactName, placeholder, and clearing the input value
            if(elem.value !== ''){
            objContact.contactName = elem.value;
                elem.placeholder = elem.value;
                elem.value = ''; 
            };

            // Reset the Request Page
            setProfileData({...profileData});
        }catch(err){console.log('handleRename: '+ err)}
    };

    const handleRequestSend = () =>{
        try{
            let count = 0;
            let TRIES = 10;
            let callback = data => {
                count++;
                if(data.uid){
                    clearInterval(interval);

                    let uid = reference.current.querySelector('#requestOptions_rename').dataset.uid;
                    let elemParticipantArray = reference.current.querySelectorAll('.requestOptionsCheckbox');
                    
                    // Getting the element containing uid of the contact
                    let elem = reference.current.querySelector('#requestOptions_rename');
                    // Getting the element that contains the contactName
                    let objContact = profileData.contactList.find(obj=>(obj.uid === elem.dataset.uid));
                    
                    // Create a hashArray if the participant is selected
                    let hashArray = [];
                    elemParticipantArray.forEach(elem=>{
                        if(elem.checked){hashArray.push(elem.id.slice(8,))}
                    });

                    // Guard-Clause if hashArray is empty
                    if(hashArray.length===0){return};

                    // Create an array of selected person objects
                    let recipientArray = [];
                    let senderArray = [];

                    hashArray.forEach(hash=>{
                        let filterPerson = persons.find(obj=>obj.hash === hash);
                        let dateNow = new Date().getTime();
                        
                        let recipientObj = {...filterPerson, type: 'receive', timestamp: dateNow, sender: data.uid, arriveTime: '~', leaveTime: '~', senderName: data.displayName};
                        let senderObj = {...filterPerson, type: 'sent', timestamp: dateNow, sender: data.uid, arriveTime: '~', leaveTime: '~', receiverName: objContact.contactName};
                        
                        recipientArray.push(recipientObj);
                        senderArray.push(senderObj);
                    });
                    
                    // Send object recipient and sender in Firebase
                    recipientArray.forEach(obj=>{funcAuth_updateData(`/users/${uid}/requests`, obj)});
                    senderArray.forEach(obj=>{funcAuth_updateData(`/users/${data.uid}/requests`, obj)});
                    
                    // Clear inputs and checkboxes and searchResults
                    elemParticipantArray.forEach(elem=>{if(elem.checked){elem.click()}});
                    reference.current.querySelector('#requestOptions_search').value = '';
                    setSearchResults([]);
                    reference.current.querySelector('.close').click();

                }else if(count > TRIES){return}

            };; //Callback Host
            let interval = setInterval(()=>callback(auth.currentUser),1000);
            
        }catch(err){console.log('handleRequestSend: ' + err)}
    };

    const handleRequestTake = () =>{
        try{
            let count = 0;
            let TRIES = 10;
            let callback = data => {
                count++;
                if(data.uid){
                    clearInterval(interval);

                    let uid = reference.current.querySelector('#requestOptions_rename').dataset.uid;
                    let elemParticipantArray = reference.current.querySelectorAll('.requestOptionsCheckbox');

                    // Getting the element containing uid of the contact
                    let elem = reference.current.querySelector('#requestOptions_rename');
                    // Getting the element that contains the contactName
                    let objContact = profileData.contactList.find(obj=>(obj.uid === elem.dataset.uid));

                    // Create a hashArray if the participant is selected
                    let hashArray = [];
                    elemParticipantArray.forEach(elem=>{
                        if(elem.checked){hashArray.push(elem.id.slice(8,))}
                    });

                    // Guard-Clause if hashArray is empty
                    if(hashArray.length===0){return};

                    // Create an array of selected person objects
                    let recipientArray = [];
                    let senderArray = [];
                    hashArray.forEach(hash=>{
                        let filterPerson = persons.find(obj=>obj.hash === hash);
                        let dateNow = new Date().getTime();
                        
                        let recipientObj = {...filterPerson, type: 'take_receive', timestamp: dateNow, sender: data.uid, arriveTime: '~', leaveTime: '~', senderName: data.displayName};
                        let senderObj = {...filterPerson, type: 'take_sent', timestamp: dateNow, sender: data.uid, arriveTime: '~', leaveTime: '~', receiverName: objContact.contactName};
                        
                        recipientArray.push(recipientObj);
                        senderArray.push(senderObj);
                    });

                    // Send object recipient and sender in Firebase
                    recipientArray.forEach(obj=>{funcAuth_updateData(`/users/${uid}/requests`, obj)});
                    senderArray.forEach(obj=>{funcAuth_updateData(`/users/${data.uid}/requests`, obj)});
                    
                    // Clear inputs and checkboxes and searchResults
                    elemParticipantArray.forEach(elem=>{if(elem.checked){elem.click()}});
                    reference.current.querySelector('#requestOptions_search').value = '';
                    setSearchResults([]);
                    reference.current.querySelector('.close').click();

                }else if(count > TRIES){return};

            };;//Callback Host
            let interval = setInterval(()=>callback(auth.currentUser),1000);
        }catch(err){console.log('handleRequestTake: '+ err)}

    };

    
    return (
        <div>
            <div style={{display:'flex', boxShadow:"1px 1px 4px 0px #8888", justifyContent:'center', borderRadius:'5px', alignItems:'center', width:'100%'}}>
                
                {/* Renaming Inputbar */}
                <div style={{width:'100%'}}>
                    <InputBar ids='requestOptions_rename' placeholder='Rename' func_onChange={()=>{}} styles={{width:'100%'}}/>
                </div>

                {/* Request rename Button */}
                <div onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--tetradicGreen)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--analogousGreen)'} onClick={()=>handleRename()}
                    style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'var(--analogousGreen)', cursor:'pointer', display:'flex', flexWrap:'nowrap', marginBottom:'10px', width:'10rem', marginTop:'10px'}}>
                    <h4 className="textDesign1" style={{ margin:'auto', color:'var(--sec-backgroundColor)', fontSize:'15px'}}>Rename</h4>
                </div>

                {/* Request Delete Button */}
                <div id='requestOptions_delete' data-uid='' onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--complimentRed)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--triadicRed)'} onClick={e=>handleDeleteContact(e)}
                    style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'var(--triadicRed)', cursor:'pointer', display:'flex', flexWrap:'nowrap', marginBottom:'10px', width:'10rem', marginTop:'10px'}}>
                    <h4 className="textDesign1" style={{ margin:'auto', color:'var(--sec-backgroundColor)', fontSize:'15px'}}>Delete</h4>
                </div>

            </div>

            <div style={{display:'flex', boxShadow:"1px 1px 4px 0px #8888", justifyContent:'center', borderRadius:'5px', alignItems:'center', width:'100%'}}>
                
                {/* Participant Search Inputbar */}
                <div style={{width:'100%'}}>
                    <InputBar ids='requestOptions_search' placeholder='Search Participant' func_onChange={handleParticipantSearch} styles={{width:'60%'}}/>
                </div>

                {/* Request Send Button */}
                <div onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--tetradicGreen)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--analogousGreen)'} onClick={()=>handleRequestSend()}
                    style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'var(--analogousGreen)', cursor:'pointer', display:'flex', flexWrap:'nowrap', marginBottom:'10px', width:'10rem', marginTop:'10px'}}>
                    <h4 className="textDesign1" style={{ margin:'auto', color:'var(--sec-backgroundColor)', fontSize:'15px'}}>Send</h4>
                </div>

                {/* Request Take Button */}
                <div onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--analogousBlue)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--columbianBlue)'} onClick={()=>handleRequestTake()}
                    style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", marginRight:'5px', borderRadius:'5px', border:'2px solid black', backgroundColor:'var(--columbianBlue)', cursor:'pointer', display:'flex', flexWrap:'nowrap', marginBottom:'10px', width:'10rem', marginTop:'10px'}}>
                    <h4 className="textDesign1" style={{ margin:'auto', color:'var(--sec-backgroundColor)', fontSize:'15px'}}>Take</h4>
                </div>

            </div>

            <div style={{display:'flex', flexWrap:'wrap'}}>

                {/* List of Participants */}
                {searchResults.map((obj,i)=>(
                    <div key={i} style={{margin:'0 5px', padding:'0 3px', position:'relative'}}>
                        
                        <label htmlFor={'request_' + obj.hash}>
                            <Avatar classes='requestAvatars' ids={'avatar_' + obj.hash} func_function={()=>{}} firstname={obj.firstname} lastname={obj.lastname} base64={obj.base64}/>
                            <input className='requestOptionsCheckbox' id={'request_' + obj.hash} type='checkbox' name='requestRadio' onChange={e=>handleCheckbox(e)} style={{display:'none'}}/>
                        </label>

                    </div>
                ))}
            </div>

        </div>
           
        
    );
};

export default RequestOptions