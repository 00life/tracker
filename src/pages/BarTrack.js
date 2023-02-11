import React, { useState, useEffect } from "react";

import { useAuth } from '../context/AuthContext';

import InputBar from "../components/inputBar";
import Avatar from "../components/Avatar";



function BarTrack(){
    const {configuration, setConfiguration, outPeople, backPeople} = useAuth();
    const [nowTime, setNowTime] = useState(null);
    

    useEffect(()=>{
        let timer = setInterval(()=>{
            setNowTime(new Date().getTime());      
        }, 1000);
        return function cleanup(){
            clearInterval(nowTime);
            clearInterval(timer)};
    },[nowTime]);


    const handleRateLimit = e => {
        if(e === '' || isNaN(e)){
            setConfiguration({...configuration, rateLimit:0})
        }else{
           setConfiguration({...configuration, rateLimit: parseInt(e)}) 
        };
    };

    const handTimeLimit = e => {
        if(e === '' || isNaN(e)){
            setConfiguration({...configuration, timeLimit:0})
        }else{
           setConfiguration({...configuration, timeLimit: parseInt(e)}) 
        };
    };
    

    return(
    <div>

        <div style={{backgroundColor:'var(--sec-backgroundColor)', padding:'5px', borderRadius:'5px', boxShadow:'1px 1px 4px 0px #8888', marginBottom:'5px'}}>
            <div style={{display:'flex'}}>
                
                {/* Rate Limit Input */}
                <div style={{width:'100%', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'space-evenly', padding:'5px'}}>
                    <label htmlFor='Input-rateLimit' style={{color:'var(--main-textColor)'}}>Rate Limit:</label>
                    <InputBar ids='Input-rateLimit' func_onChange={handleRateLimit} placeholder={configuration.rateLimit+' 🏃'}/>     
                </div>
                
                {/* Time Limit Input */}
                <div style={{width:'100%', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'space-evenly', padding:'5px'}}>
                    <label htmlFor='Input-timeLimit' style={{color:'var(--main-textColor)'}}>Time Limit:</label>
                    <InputBar ids='Input-timeLimit' func_onChange={handTimeLimit} placeholder={configuration.timeLimit+' min'}/>
                </div>

            </div>
        </div>
        <div style={{backgroundColor:'var(--main-backgroundColor)', borderRadius:'5px', boxShadow:'1px 1px 4px 0px #8888'}}>
            
            <div style={{display:'flex'}}>

                {/* Title Header for » */}
                <div style={{width: '100%', display:'flex', justifyContent:'center', boxShadow:'1px 1px 4px 0px #8888'}}>
                    <div style={{color:'var(--main-textColor)', fontSize:'20px', fontWeight:'bolder'}}>
                        <span style={{color:'green'}}>(»)</span>
                    </div>
                </div>

                {/* Title Header for « */}
                <div style={{width: '100%', display:'flex', justifyContent:'center', boxShadow:'1px 1px 4px 0px #8888'}}>
                    <div style={{color:'var(--main-textColor)', fontSize:'20px', fontWeight:'bolder'}}>
                        <span style={{color:'blue'}}>(«)</span>
                    </div>
                </div>
            </div>

            <div style={{display:'flex', height:'60vh'}}>
                <div style={{width: '100%', display:'flex', boxShadow:'1px 1px 4px 0px #8888', padding:'15px'}}>
                    {outPeople.map((obj,i)=>(
                        <div key={i}>
                            <div style={{margin:'5px', position:'relative'}}>

                                {/* Timer Display */}
                                <div className='textDesign1' style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', 
                                    
                                    // Conditions for Colors
                                    color: Math.round((nowTime - obj.timestamp)/1000/60) > configuration.timeLimit && configuration.timeLimit !== 0 
                                        ? 'tomato': 'palegreen' }}>
                                    
                                    {(nowTime !== null) ? Math.round((nowTime - obj.timestamp)/1000/60) : '~'}
                                    <span style={{fontSize:'10px'}}>min</span>
                                </div>
                                
                                {/* Avatar Display */}
                                <Avatar hash={obj.hash} func_function={()=>{}} firstname={obj.firstname} lastname={obj.lastname} base64={obj.base64} styles={{height:'50px', width:'50px'}} />
                            </div>
                        </div>
                    ))} 
                </div>
                <div style={{width: '100%', display:'flex', boxShadow:'1px 1px 4px 0px #8888', padding:'15px'}}>
                    {backPeople.map((obj,i)=>(
                        <div key={i}>
                            <div style={{margin:'5px', position:'relative'}}>

                                {/* Duration Display */}
                                <div className='textDesign1' style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                                    
                                    // Condition for Colors
                                    color: obj.duration > configuration.timeLimit && configuration.timeLimit !==0
                                        ? 'tomato':'white'}}>
                                    
                                    {obj.duration}
                                    <span style={{fontSize:'10px'}}>min</span>
                                </div>

                                {/* Avatar Display */}
                                <Avatar hash={obj.hash} func_function={()=>{}} firstname={obj.firstname} lastname={obj.lastname} base64={obj.base64} styles={{height:'50px', width:'50px'}} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
)};

export default BarTrack