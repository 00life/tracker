import React, {useEffect} from "react";
import { useAuth } from '../context/AuthContext';
import { auth } from "../context/Firebase";
import { funcAuth_updateData, funcAuth_loadValData, funcAuth_setData } from "../context/Functions_Auth";

function TakeReceivingParticipant({firstname, lastname, timestamp, sender, confirm, hash, schedule, email, base64, arriveTime, leaveTime, senderName}){
    const { reference, persons, setPersons } = useAuth();

    const handleConfirming = e => {  
        let receiveCheckbox = reference.current.querySelector('#receiveCheckbox_'+timestamp);
        let ans = false;
        let objConfirm = {};

        // Guard-Clause to check if already accepted
        if(receiveCheckbox.checked){return}else{ans = window.confirm('Accept Request?')};
       
        if(ans){receiveCheckbox.checked = true};
        
        if(receiveCheckbox.checked){
            objConfirm = {type: 'confirm', timestamp: timestamp, ans: true};
        }else{
            objConfirm = {type: 'confirm', timestamp: timestamp, ans: false};
        };
        
        // Update the Request list on firebase
        funcAuth_updateData(`/users/${sender}/requests`, objConfirm);
        funcAuth_updateData(`/users/${auth.currentUser.uid}/requests`, objConfirm);

        // Create a person object
        const person = {
            hash: hash,
            firstname: firstname,
            lastname: lastname,
            email: email,
            base64: base64,
            schedule: schedule,
            sender: sender,
            timestamp: timestamp,
        };

        // Add participant to your watch list
        funcAuth_updateData(`/users/${auth.currentUser.uid}/watch`, person);

        // Add participant to the persons if it doesn't already exist
        let filterPersons = persons.filter(obj=>obj.hash === person.hash);
        if(filterPersons.length === 0){setPersons([...persons, person])};
        
    };

    const handleDeleteRequestEntry = () => {
        let callback = data =>{
            // Get all object with the matching timestamp
            let filterArray = data.filter(obj=>obj.timestamp === timestamp);

            // Delete each matching object
            filterArray.forEach(obj=>{
                funcAuth_setData(`/users/${auth.currentUser.uid}/requests/${obj.key}`, {key: null});
            });
        } ;; // Callback Host
        funcAuth_loadValData(`/users/${auth.currentUser.uid}/requests`, callback);

    };

    useEffect(()=>{
        // Guard-clause to exit if confirm is empty
        if(confirm.length===0){return}
        
        // See if the timestamp matches
        let filterConfirm = confirm.filter(obj=>obj.timestamp === timestamp);

        // Guard-clause to see if there are any matches
        if(filterConfirm.length===0){return}
        
        // Ensure no repeats (unique) values in the array
        let confirmSet = new Set();
        filterConfirm.forEach(obj=>confirmSet.add(JSON.stringify(obj)));
        let confirmArray = Array.from(confirmSet).map(obj=>JSON.parse(obj));
        
        if(confirmArray[0].ans === true){
            // Put a checkmark on the html
            reference.current.querySelector('#checkspan_'+timestamp).innerHTML = '&#x2611;';
            reference.current.querySelector('#checkspan_'+timestamp).parentNode.style.backgroundColor = 'var(--tetradicGreen)';
        }else{
            // Put a x on the html
            reference.current.querySelector('#checkspan_'+timestamp).innerHTML = '&#x2612;';
            reference.current.querySelector('#checkspan_'+timestamp).parentNode.style.backgroundColor = 'var(--complimentRed)';
        };

        //Setting the checkbox to true so it cannot be selected again
        reference.current.querySelector('#receiveCheckbox_'+timestamp).checked = true;
        
    },[confirm.length])

    return(
        <div style={{border:'1px solid #8888', borderRadius:'5px', margin:'2px 0', padding:'5px 5px', display:'flex', alignItems:'center', flexWrap:'wrap'}}>
            <input id={'receiveCheckbox_' + timestamp} type='checkbox'  style={{display:'none'}}/>

            {/* Type of Request and confirmation */}
            <span onClick={e=>handleConfirming(e)} style={{border:'1px solid #8888', borderRadius:'5px', padding:'2px 5px', backgroundColor:'var(--analogousBlue)', cursor:'pointer'}}>
                Sent <span id={'checkspan_'+timestamp}>&#x10102;</span>
            </span>

            <span>&nbsp;::&nbsp;</span>

            <span style={{border:'1px solid #8888', borderRadius:'5px', padding:'2px 5px', backgroundColor:'var(--complimentYellow)'}}>{senderName}</span>

            <span>&nbsp;::&nbsp;</span>

            {/* Fistname and Lastname of Participant */}
            <span>{firstname}&nbsp;{lastname}</span>

            <span>&nbsp;::&nbsp;</span>

            {/* Time that the request was made */}
            <span>{(new Date(timestamp).toLocaleTimeString()).slice(0,-6)}</span>
            <span>{(new Date(timestamp).toLocaleTimeString()).slice(-2,)}</span>

            <span>&nbsp;::&nbsp;</span>

            {/* Time that the Participant arrived */}
            <span>»&nbsp;{arriveTime}&nbsp; </span>

            <span>&nbsp;::&nbsp;</span>

            {/* Time that the Participant left */}
            <span style={{color:'var(--selectBlue)'}}>«&nbsp;{leaveTime}&nbsp; </span>

            <span>&nbsp;::&nbsp;</span>

            <h3 style={{color:'var(--main-textColor)'}}>Take</h3>
            
            {/* Spacer to seperate items */}
            <div style={{flexGrow:1}}>&nbsp;</div>

            {/* Delete Request */}
            <span onClick={()=>handleDeleteRequestEntry()} style={{float:'right', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', cursor:'pointer'}}>
            <svg height="24" width="24"><path d="M7.2 21.3q-1.05 0-1.75-.7t-.7-1.75V5.9h-1V3.75h5.2V2.675h6.15V3.75h5.2V5.9h-1v12.95q0 1.025-.713 1.737-.712.713-1.737.713Zm9.95-15.4H6.9v12.95q0 .125.088.212.087.088.212.088h9.65q.1 0 .2-.1t.1-.2ZM8.875 17.125h2.15v-9.2h-2.15Zm4.15 0h2.15v-9.2h-2.15ZM6.9 5.9V19.15v-.3Z"/></svg>
            </span>

        </div>
    );
};

export default TakeReceivingParticipant;