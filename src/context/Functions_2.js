// import { func_dataURItoBlob } from "./Functions_1";
import { auth } from "./Firebase";
import { funcAuth_loadData } from "./Functions_Auth";
import beepGo from '../sounds/beep-07a.mp3';
import beepStop from '../sounds/beep-10.mp3';
import beepBack from '../sounds/beep-08b.mp3';


export function func2_config(configuration, setConfiguration){
// Load the autoload toggle button to its previous settings
    try{
        let autoConfig = JSON.parse(window?.localStorage?.getItem('config'));
        setConfiguration({...configuration, onlineLoadParticipant:!autoConfig.onlineLoadParticipant});
        return autoConfig
    }catch(err){console.log('func_config:'+err)};
};

export function func2_autoLoadPersons(persons, setPersons){
    let autoConfig = JSON.parse(window?.localStorage?.getItem('config'));
    let TRIES = 10;
    try{
        // Guard-Clause if the toggle is turned off (NOTE: true/false is backwards)
        if(autoConfig.onlineLoadParticipant){return}

        let count = 0;

        // Check if you have auth access to firebase
        let callback = uid => {
            count++;
            if(uid){
                clearInterval(interval);
                
                // Load the data from firebase if data is not null
                let callback2 = data2 =>{
                    if(data2!==null){setPersons([...persons, ...data2])};
                } ;; // Callback2 Host
                funcAuth_loadData(`/users/${uid}/participants`, callback2);

            // Gives up after TRIES
            }else if(count > TRIES){return}

        } ;; // Callback Host
        let interval = setInterval(()=>callback(auth.currentUser.uid),1000);
        
    }catch(err){console.log('func2_autoLoadPersons: ' + err)}
};

export function func2_toDataURL(src, callback){
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
       canvas.height = this.naturalHeight;
       canvas.width = this.naturalWidth;
       context.drawImage(this, 0, 0);
       var dataURL = canvas.toDataURL('image/jpeg');
       callback(dataURL);
    };
    image.src = src;
};

export function func2_stringDateName(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0'+String(parseInt(date.getMonth())+1)).slice(-2);
    let day = ('0'+date.getDate()).slice(-2);
    let time = date.toLocaleString('en-US', {hour12: false});
    let hours = time.slice(-8,-6);
    let minutes = time.slice(-5,-3);
    let seconds = time.slice(-2,);
    return `${year}.${month}.${day}_${hours}.${minutes}.${seconds}`;
};

export async function func2_playAudio(type){
    try{
    // Default Beep
        
        let audioType = beepGo;

        if(type==='go'){
            audioType = beepGo;
        }else if(type==='stop'){
            audioType = beepStop;
        }else if(type==='back'){
            audioType = beepBack
        };

        const audio = new Audio(audioType);
        await audio.play();
    }catch(err){console.log('func2_playAudio: '+err)}
};

export function func2_visualEffect(reference,id='rateLimitVisual',color='palegreen'){
    try{
    reference.current.querySelector('#'+id).style.display = 'block';
    reference.current.querySelector('#'+id).style.backgroundColor = color;
    setTimeout(()=>{
        reference.current.querySelector('#'+id).style.display = 'none';
        reference.current.querySelector('#'+id).style.backgroundColor = '';
    },250)
    }catch(err){console.log('func2_visualEffect: ' + err)}
};
