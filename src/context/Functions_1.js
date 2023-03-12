import { funcAuth_loadData, funcAuth_setData } from './Functions_Auth';
import {auth} from './Firebase';


export function func_snackbar(reference, message) {
// Shows an 3 sec animated notification at the bottom
  try{
    var x = reference.current.querySelector('#snackbar');
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }catch(err){console.log('func_snackbar:'+err)}
};

export function func_savedata(data, name, path, reference){
  // Saves data online or on your computer (must provide name);
  try{

    let ans = window.confirm('Save online?');
    
    // If answer is yes, it will save online
    if(ans){

      // Guard-Clause if the user is not online
      if(auth.currentUser === null){
        func_snackbar(reference, 'Please sign-in to save online');
        return
      };

      let uid = auth.currentUser.uid;
      let path_online = `users/${uid}${path}`;
      
      funcAuth_setData(path_online, data);
      return true
    
    // If the answer is no, it will save to your computer
    }else{

      var string_data = JSON.stringify(data);
      var file = new File([string_data],{type:'text/csv;charset=utf-8'});
      let href_link = window.URL.createObjectURL(file);
      var anchor = window.document.createElement('a');
      anchor.setAttribute('href', href_link);
      anchor.setAttribute('download', name);
      anchor.click();
      URL.revokeObjectURL(href_link);
  
    };
    func_saveObjLocalStorage('config', {saveName:name}) //fix
    return false
  
  }catch(err){console.log('func_savedata:'+err)}
};


export function func_loaddata(path, callback, reference){
// Loads data from a file on your computer
  try{

    let ans = window.confirm('Load from online?');

    // If answer is yes, it will load from online
    if(ans){

      // Guard-Clause if the user is not online
      if(auth.currentUser === null){
        func_snackbar(reference, 'Please sign-in to load from online');
        return
      };

      let uid = auth.currentUser.uid;
      let path_online = `users/${uid}${path}`;
      let callback2 = data => {
        callback(data)
      } ;; // Callback2 Host
      funcAuth_loadData(path_online, callback2)

    // If the answer is no, it will load from your computer
    }else{

      const elem_input = document.createElement('input');
      elem_input.setAttribute('type', 'file');
      elem_input.click();
      elem_input.onchange = function(e){
        var file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
          var load = JSON.parse(reader.result);
          callback(load);
        };
        reader.readAsText(file);
      };
    }
  }catch(err){console.log('func_loaddata:'+err)}
};


export function func_convertFrom24To12Format(time24){
// Converts 24:00 format into 12:00 AM/PM format
  try{
    const [sHours, minutes] = time24?.match(/([0-9]{1,2}):([0-9]{2})/)?.slice(1);
    const period = +sHours < 12 ? 'AM' : 'PM';
    const hours = +sHours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }catch(err){console.log('func_convertFrom24To12Format:'+err)};
};


export function func_cleanArray(array){
// Removes excess spaces from an array and capitalize the first letter
  try{
    let cleanArray = array.map(item=>item.trim());
    let filterArray = cleanArray.filter(item=>item!=='');
    let rmSpacesArray = filterArray
        .map(item=>item.split(' ')
          .map(item=>item.trim())
          .map(item=>item[0].toUpperCase()+item.slice(1,).toLowerCase())
          .filter(item=>item!=='')
          .join(' ')
        );
    return rmSpacesArray
  }catch(err){console.log('func_cleanArray:'+err)}
};


export function func_stringBase64File(elem, callback){
// Converts an input file into base 64 data from your computer
  try{
    let file = elem.files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result)
    }
    reader?.readAsDataURL(file);
  }catch(err){console.log('func_stringBase64File:'+err)}
};


export const func_getBase64FromUrl = async (url) => {
// Converts URL data into base64 data
  try{
    const data = await fetch(url,{mode:'no-cors'});
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
  }catch(err){console.log('func_getBase64FromUrl:'+err)}
};


export function func_modalview(reference, id){
  try{
    let modal = reference.current.querySelector(id);
    let span = reference.current.querySelectorAll(".close")[0];
    modal.style.display = "block"

    span.onclick = function() {
      modal.style.display = "none";
    };

    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }catch(err){console.log('func_modelview:'+err)}
};


export async function func_generateQR(data, type='svg'){
  var resp;
  try{
    if(type==='svg'){    
      resp = await require('qrcode').toString(data);
    }else if(type==='base64'){
      resp = await require('qrcode').toDataURL(data);
    }else if(type==='canvas'){
      resp = await require('qrcode').toCanvas(data);
    };
    return resp
  }catch(err){console.error('func_generateQR:'+err)};
};


export function func_blobToDataURI(blob, callback){
  const reader = new FileReader();

  reader.onload = (event) => {
    callback(event.target.result)
  }
  reader.readAsDataURL(blob);
};


// export function func_dataURItoBlob(dataURI) {
//   // convert base64 to raw binary data held in a string
//   var byteString = atob(dataURI.split(',')[1]);

//   // separate out the mime component
//   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//   // write the bytes of the string to an ArrayBuffer
//   var arrayBuffer = new ArrayBuffer(byteString.length);
//   var _ia = new Uint8Array(arrayBuffer);
//   for (var i = 0; i < byteString.length; i++) {
//       _ia[i] = byteString.charCodeAt(i);
//   }

//   var dataView = new DataView(arrayBuffer);
//   var blob = new Blob([dataView], { type: mimeString });
//   return blob;
// };


export function func_saveObjLocalStorage(storageName='config', obj){
  try{
    let autoConfig = JSON.parse(window?.localStorage?.getItem(storageName));
    window?.localStorage?.setItem(storageName, JSON.stringify({...autoConfig, ...obj}));
  }catch(err){console.log('func_saveObjLocalStorage:'+err)};
};