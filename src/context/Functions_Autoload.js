import preval from 'babel-plugin-preval/macro';
import { funcAuth_loadData } from './Functions_Auth';
import { auth } from './Firebase';

export function funcAuto_localStorageAutoConfig(){
    try{
        // Getting the localStorage data from 'autoconfig'
        let obj = JSON?.parse(window?.localStorage?.getItem('autoconfig'));
        
        if(obj!==undefined||obj!==null){
            return {resp:true, obj:obj}
        }else{
            return {resp:false, obj:undefined}
        };
    }catch(err){console.log('funcAuto_localStorageAutoConfig: ' + err)}
};

export function funcAuto_autoConfigLoad(){
    try{
        
        // Loading the Togle buttons settings
        let loadAutoConfig = preval`
            const fs = require('fs'); 
            if(fs.existsSync('C:/trackerR324/autoconfig.txt')){
                module.exports = fs.readFileSync('C:/trackerR324/autoconfig.txt', 'utf8')
            }else if(fs.existsSync('/home/trackerR324/autoconfig.txt', 'utf8')){
                module.exports = fs.readFileSync('/home/trackerR324/autoconfig.txt', 'utf8')
            };
        `;
        let obj = JSON?.parse(loadAutoConfig);
        return obj

    }catch(err){console.log('funcAuto_autoConfigLoad: ' + err)}
};

export function funcAuto_load_Participants_N_Profile(obj){
    
    try{
        // Guard-Clause 
        if(obj === undefined||obj === null){return};    

        // Getting the keys and values of autoconfig.txt
        let valArrayAutoConfig = Object.values(obj);
        let keyArrayAutoConfig = Object.keys(obj);

        // Getting the keys with true values
        let trueValsAutoConfig = valArrayAutoConfig.map((val, i) => (val===true) ? i : undefined).filter(val=>(val!==undefined));
        let trueKeysAutoConfig = trueValsAutoConfig.map(index => keyArrayAutoConfig[index]).filter(val=>(val!==undefined));
        
        // Initializing Variables
        var setPersons = [];
        var setProfile = {};

        trueKeysAutoConfig.forEach(item=>{

            if(item === 'participantsWin' && obj.participantsWin){
                let dataParticipants = preval`
                    const fs = require('fs');
                    if(fs.existsSync('C:/trackerR324/participants.txt')){
                        module.exports = fs.readFileSync('C:/trackerR324/participants.txt', 'utf8')
                    };
                `;
                if(dataParticipants?.length!==undefined){
                    setPersons = JSON?.parse(dataParticipants);
                };
                

            }else if(item==='participantsLin' && obj.participantsLin){
                let dataParticipants = preval`
                    const fs = require('fs');
                    if(fs.existsSync('/home/trackerR324/participants.txt')){
                        module.exports = fs.readFileSync('/home/trackerR324/participants.txt', 'utf8')
                    };
                `;
                if(dataParticipants?.length===undefined){
                    setPersons = JSON?.parse(dataParticipants);
                };
                

            }else if(item==='profileWin' && obj.profileWin){
                let dataProfile = preval`
                    const fs = require('fs');
                    if(fs.existsSync('C:/trackerR324/profile.json')){
                        module.exports = fs.readFileSync('C:/trackerR324/profile.json', 'utf8')
                    };
                `;
                let objKeysArray = Array.from(Object.keys(dataProfile));
                if(objKeysArray?.length !== undefined || objKeysArray?.length > 0){
                    setProfile = JSON?.parse(dataProfile);
                };
                

            }else if(item==='profileLin' && obj.profileLin){
                let dataProfile = preval`
                    const fs = require('fs');
                    if(fs.existsSync('/home/trackerR324/profile.json')){
                        module.exports = fs.readFileSync('/home/trackerR324/profile.json', 'utf8')
                    };
                `;
                let objKeysArray = Array.from(Object.keys(dataProfile));
                if(objKeysArray?.length !== undefined || objKeysArray?.length > 0){
                    setProfile = JSON?.parse(dataProfile);
                };
                
            };
        
        });

        return ({
            setPersons: (setPersons===undefined || setPersons===null) ? [] : setPersons, 
            setProfile: (setProfile===undefined || setProfile===null) ? {} : setProfile,
        });

    }catch(err){console.log('funcAuto_load_Participants_N_Profile: ' + err)}
};

export function funcAuto_cleanYesterdaysRequests(){
    try{
        let count = 0;
        let TRIES = 10;

        // Check if you have auth access to firebase
        let callback = uid => {
            count++;
            if(uid){
                clearInterval(interval);

                // Load the data from firebase if data is not null
                let callback2 = data2 =>{
                    if(data2 !== null){
                        let date = new Date();
                        let timestampOld = Object?.values(data2)[0]?.timestamp;
                        
                        // Guard-Clause if timestampOld is undefined
                        if(timestampOld===null||timestampOld===undefined){return}
                        
                        // Checking if the recorded timestamp.day is the same as todays timestamp.day
                        if(JSON.stringify(new Date(timestampOld).getDate()) !== JSON.stringify(date.getDate())){
                            window.document.querySelector('#Layout_clearRequests').click();
                            return
                        };
                    };
                } ;; // Callback2 Host
                funcAuth_loadData(`/users/${uid}/requests`, callback2);
            
            // Gives up after 20 tries
            }else if(count > TRIES){return};

        } ;; // Callback Host
        let interval = setInterval(()=>callback(auth.currentUser.uid),1000);

    }catch(err){console.log('funcAuto_cleanYesterdaysRequests: ' + err)}
};