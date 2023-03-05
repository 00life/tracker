import { func_dataURItoBlob } from "./Functions_1";
import beepGo from '../sounds/beep-07a.mp3';
import beepStop from '../sounds/beep-10.mp3';
import beepBack from '../sounds/beep-08b.mp3';


export function func_config(setConfig){
// Load the autoload toggle button to its previous settings
    try{
        let autoConfig = JSON.parse(window?.localStorage?.getItem('config'));  
        setConfig({...autoConfig, auto:!autoConfig.auto});
    }catch(err){console.log('func_config:'+err)};
};


export function func2_autoLoadPersons(persons, setPersons, func_snackbar, reference){
// Load persons at startup from file location
    try{
        let autoConfig = JSON.parse(window?.localStorage?.getItem('config'));
        if(persons.length === 0 && !autoConfig.auto){
            let blob = func_dataURItoBlob(autoConfig.persons);
            
            var reader = new FileReader();
            reader.onloadend = function(){
                var load = JSON.parse(reader.result);
                setPersons(load);
            };
            reader.readAsText(blob);
        };
    }catch(err){
        func_snackbar(reference,'Load at least once to set autoload')
        console.log('func_autoLoadPersons:'+err)
    }

    // try{
    //     let localStoragePersons = JSON.parse(window?.localStorage?.getItem('persons'));
    //     setPersons([...localStoragePersons]);
    //     func_snackbar(reference,'Autoload from memory')
    // }catch(err){console.log('func2_autoLoadPersons: ' + err)}
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
