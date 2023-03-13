import { auth } from "./Firebase";
import { funcAuth_loadData, funcAuth_loadValData, funcAuth_setData } from "./Functions_Auth";


export function func3_stripStoragePersons(persons){
    
    // Iterate through the persons array
    let newPersons = persons.map(obj=>{
        
        // Create a new person object with limited data
        let person = {
            firstname: obj.firstname,
            lastname: obj.lastname,
            schedule: [],
            hash: obj.hash,
            base64: '',
          };

        // returning the person object into the newPersons array
        return person
    });

    // set the newPersons Array to the localStorage in memory
    localStorage.setItem('persons', JSON.stringify(newPersons));
};

export function func3_handleHashWatch(type, hash){
    //USER Callback
    let callback = data => {
        data.forEach(obj=>{
            if(obj.hash===hash){
                
                // USER Callback
                let callback2 = data2 => {
                    data2.forEach(obj2=>{
                        if(obj2.timestamp === obj.timestamp && (obj2.type === 'receive' || obj2.type === 'sent') ){
                            let date = new Date();
                            let nowTime = date.toLocaleTimeString().slice(0, 5) + date.toLocaleTimeString().slice(-2,);
                        
                            // Rewriting the values on USERS firebase
                            if(type === 'arrive' && obj2.arriveTime === '~'){
                                funcAuth_setData(`users/${auth.currentUser.uid}/requests/${obj2.key}`, {...obj2, arriveTime: nowTime});
                                return
                            }else if(type === 'leave' && obj2.leaveTime === '~'){
                                funcAuth_setData(`users/${auth.currentUser.uid}/requests/${obj2.key}`, {...obj2, leaveTime: nowTime});
                                return
                            };
                        };
                    });
                } ;; // Callback Host from the USER
                funcAuth_loadValData(`users/${auth.currentUser.uid}/requests`, callback2);

                // SENDER Callback
                let callback3 = data3 => {
                    data3.forEach(obj3=>{
                        if(obj3.timestamp === obj.timestamp && (obj3.type === 'receive' || obj3.type === 'sent') ){
                            let date = new Date();
                            let nowTime = date.toLocaleTimeString().slice(0, 5) + date.toLocaleTimeString().slice(-2,);
                        
                            // Rewriting the values on SENDER firebase
                            if(type === 'arrive' && obj3.arriveTime === '~'){
                                funcAuth_setData(`users/${obj.sender}/requests/${obj3.key}`, {...obj3, arriveTime: nowTime});
                                return
                            }else if(type === 'leave' && obj3.leaveTime === '~'){
                                funcAuth_setData(`users/${obj.sender}/requests/${obj3.key}`, {...obj3, leaveTime: nowTime});
                                return
                            };
                        };
                    });
                } ;; // Callback Host from the SENDER
                funcAuth_loadValData(`users/${obj.sender}/requests`, callback3);
            };
        });
    } ;; // Callback Host from the USER
    funcAuth_loadValData(`users/${auth.currentUser.uid}/watch`, callback)
};

export function func3_requestNotify(){  
    try{
        let count = 0;
        let TRIES = 10;
        
        let callback = data => {
            count++;
            if(data?.uid){
                clearInterval(interval);
                let callback2 = data2 => {
                    let sentReceive = [];
                    let confirms = [];
                    let doubleArray = [];
                    let objArray = Object.values(data2)
                    
                    objArray.forEach(obj=>{
                        if(obj.type === 'sent' || obj.type === 'receive'){
                            sentReceive.push(obj.timestamp)
                        }else if(obj.type === 'confirm'){
                            confirms.push(obj.timestamp)
                        };                    
                    });
                    
                    sentReceive.forEach(val=>{
                        confirms.includes(val) ? doubleArray.push(true) : doubleArray.push(false);
                    })

                    let result = doubleArray?.every(val=>val);
                    let finalResult = (result===undefined||result===null) ? false : result;
                    
                    if(finalResult){
                        window.document.querySelector('#Layout_notify').style.display = 'none';
                    }else{
                        window.document.querySelector('#Layout_notify').style.display = 'block';
                    };

                };;//Callback2 Host
                funcAuth_loadData(`users/${data.uid}/requests`,callback2)

            }else if(count > TRIES ){return}
        };;//Callback Host
        let interval = setInterval(()=>callback(auth.currentUser),1000);
    }catch(err){console.log('func3_requestNotify: ' + err)};
};