import { useState, useEffect } from "react";
import { auth } from "./Firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updateProfile,

} from "firebase/auth";

import {set, ref, onValue, update, child, push} from 'firebase/database';
import {db} from './Firebase';


export async function func_signup(email, password){
    try{await createUserWithEmailAndPassword(auth, email, password);
    }catch(error){console.log('Functions_Auth - func_signup: '+error)}
};


export async function func_signin(email, password){
    try{return await signInWithEmailAndPassword(auth, email, password)
    }catch(error){console.log('Functions_Auth - func_signin: '+ error)}
};


export async function func_logout(){
    try{return await signOut(auth);
    }catch(error){console.log('Functions_Auth - func_logout: '+error);}
};


export function useAuthStatus(){
    const [currentUser, setCurrentUser] = useState({});
    useEffect(()=>{

        const unsubscribe = onAuthStateChanged(auth,user=>{
            setCurrentUser(user);
        })

        return unsubscribe
    },[])
    
    return currentUser   
};


export function func_reset(email){
    return sendPasswordResetEmail(auth, email);
};

// export function updateEmail(email){
//     return currentUser.updateEmail(email);
// };

// export function updatePassword(password){
//     return currentUser.updatePassword(password);
// };

// function updateProfile(displayName, photoURL){
//     return currentUser.updateProfile({displayName, photoURL});
// };

// function emailLink(email, code){
//     return auth.signInWithEmailLink(email, code);
// };

export function funcAuth_setData(path, obj){
    try{
        return set(ref(db, path), obj)
    }catch(err){console.log('funcAuth_setData: ' + err)}
};

export function funcAuth_updateData(path, obj){
    try{
        const newPostKey = push(child(ref(db), 'posts')).key;
        const myUpdate = {};
        myUpdate[newPostKey] = {...obj, key: newPostKey};
        return update(ref(db, path), myUpdate)
    }catch(err){console.log('funcAuth_setData: ' + err)}
};

export function funcAuth_loadData(path, callback){
    try{
        const myref = ref(db, path);
        onValue(myref, snapshot=>callback(snapshot.val()));
        return
    }catch(err){console.log('funcAuth_loadData: ' + err)}
};

export async function funcAuth_loadKeyData(path, callback){
    try{
        const myref = ref(db, path);
        onValue(myref, snapshot=>callback(Object.keys(snapshot.val())));
        return
    }catch(err){console.log('funcAuth_loadkeyData: ' + err)}
};

export function funcAuth_loadValData(path, callback){
    try{
        const myref = ref(db, path);
        onValue(myref, snapshot=>callback(Object.values(snapshot.val())));
        return
    }catch(err){console.log('funcAuth_loadkeyData: ' + err)}
};

export function funcAuth_updateEmail(myEmail){
    try{
        updateEmail(auth.currentUser, myEmail);
        return myEmail
    }catch(err){console.log('funcAuth_updateEmail: ' + err)}
};

export function funcAuth_updateProfile(obj){
    try{
        updateProfile(auth.currentUser, {...obj});
        return obj
    }catch(err){console.log('funcAuth_updateProfile: ' + err)}
};