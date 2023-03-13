import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import Layout from "../context/Layout";
import ToggleBtn from "../components/ToggleBtn";
import preval from 'babel-plugin-preval/macro';
import { funcAuto_autoConfigLoad } from "../context/Functions_Autoload";


function AutoConfig(){

    const {configuration, setConfiguration, reference} = useAuth();

    // Used for the check or cancel icons
    const [exists, setExists] = useState({
        dirWin:false, participantsWin:false, profileWin:false, logWin:false, 
        dirLin:false, participantsLin:false, profileLin:false, logLin:false,
    });


    const handleSaveAutoConfig = () => {
        try{
            // Elements of the Toggle Buttons
            let elem_participantsWin = reference.current.querySelector('#checkparticipantsWin');
            let elem_profileWin = reference.current.querySelector('#checkprofileWin');
            let elem_logWin = reference.current.querySelector('#checklogWin');

            let elem_participantsLin = reference.current.querySelector('#checkparticipantsLin');
            let elem_profileLin = reference.current.querySelector('#checkprofileLin');
            let elem_logLin = reference.current.querySelector('#checklogLin');
            
            // Create object with the toggle button current state
            let objAutoConfig = {

                participantsWin: elem_participantsWin.checked,
                profileWin: elem_profileWin.checked,
                logWin: elem_logWin.checked,

                participantsLin: elem_participantsLin.checked,
                profileLin: elem_profileLin.checked,
                logLin: elem_logLin.checked,
            };

            // Save the object to localStorage
            window.localStorage.setItem('autoconfig', JSON.stringify(objAutoConfig));

            // Save the object into autoconfig.txt
            var string_data = JSON.stringify(objAutoConfig);
            var file = new File([string_data],{type:'text/csv;charset=utf-8'});
            let href_link = window.URL.createObjectURL(file);
            var anchor = window.document.createElement('a');
            anchor.setAttribute('href', href_link);
            anchor.setAttribute('download', 'autoconfig.txt')
            anchor.click();
            URL.revokeObjectURL(href_link);

        }catch(err){console.log('handleSaveAutoConfig: ' + err)}
    };

    const handleToggleConf = e => {
        try{
            if(e.currentTarget.id==='checkparticipantsWin'){
                setConfiguration({...configuration, participantsWin: e.currentTarget.checked})
            }else if(e.currentTarget.id==='checkprofileWin'){
                setConfiguration({...configuration, profileWin: e.currentTarget.checked})
            }else if(e.currentTarget.id==='checklogWin'){
                setConfiguration({...configuration, logWin: e.currentTarget.checked})
            }else if(e.currentTarget.id==='checkparticipantLin'){
                setConfiguration({...configuration, participantsLin: e.currentTarget.checked})
            }else if(e.currentTarget.id==='checkprofileLin'){
                setConfiguration({...configuration, profileLin: e.currentTarget.checked})
            }else if(e.currentTarget.id==='checklogLin'){
                setConfiguration({...configuration, logLin: e.currentTarget.checked})
            };
        }catch(err){console.log('handleToggleConf: ' + err)}
    };


    useEffect(()=>{
        // Checkboxes Window Computers 
        let trackerR324Win = preval`const fs = require('fs'); module.exports = fs.existsSync('C:/trackerR324/autoconfig.txt', 'utf8');`;
        let participantsWin = preval`const fs = require('fs'); module.exports = fs.existsSync('C:/trackerR324/participants.txt', 'utf8');`;
        let profileWin = preval`const fs = require('fs'); module.exports = fs.existsSync('C:/trackerR324/profile.json', 'utf8');`;
        let logWin = preval`const fs = require('fs'); module.exports = fs.existsSync('C:/trackerR324/log.txt', 'utf8');`;
        
        // Checkboxes Linux Computers
        let trackerR324Lin = preval`const fs = require('fs'); module.exports = fs.existsSync('/home/trackerR324/autoconfig.txt', 'utf8');`;
        let participantsLin = preval`const fs = require('fs'); module.exports = fs.existsSync('/home/trackerR324/participants.txt', 'utf8');`;
        let profileLin = preval`const fs = require('fs'); module.exports = fs.existsSync('/home/trackerR324/profile.json', 'utf8');`;
        let logLin = preval`const fs = require('fs'); module.exports = fs.existsSync('/home/trackerR324/log.txt', 'utf8');`;

        // Setting variable if those file / directorys exist
        setExists({...exists, 
            dirWin: trackerR324Win, participantsWin: participantsWin, profileWin: profileWin, logWin:logWin,
            dirLin: trackerR324Lin, participantsLin:participantsLin, profileLin: profileLin, logLin:logLin,
        });
        
        let autoconfigLS = JSON?.parse(window.localStorage.getItem('autoconfig'));
        if(autoconfigLS === undefined || autoconfigLS === null){
            
            // Loading the toggle settings from autoconfig.txt
            let obj = funcAuto_autoConfigLoad();
            
            reference.current.querySelector('#checkparticipantsWin').checked = obj?.participantsWin;
            reference.current.querySelector('#checkprofileWin').checked = obj?.profileWin;
            reference.current.querySelector('#checklogWin').checked = obj?.logWin;

            reference.current.querySelector('#checkparticipantsLin').checked = obj?.participantsLin;
            reference.current.querySelector('#checkprofileLin').checked = obj?.profileLin;
            reference.current.querySelector('#checklogLin').checked = obj?.logLin;
            
        }else{

            // Loading the toggle settings from localStorage
            reference.current.querySelector('#checkparticipantsWin').checked = autoconfigLS?.participantsWin;
            reference.current.querySelector('#checkprofileWin').checked = autoconfigLS?.profileWin;
            reference.current.querySelector('#checklogWin').checked = autoconfigLS?.logWin;

            reference.current.querySelector('#checkparticipantsLin').checked = autoconfigLS?.participantsLin;
            reference.current.querySelector('#checkprofileLin').checked = autoconfigLS?.profileLin;
            reference.current.querySelector('#checklogLin').checked = autoconfigLS?.logLin;
        };
    },[]);

    return (
        <Layout>
            <data value='/autoconfig'></data>
            <div style={{display:'flex', flexDirection:'column', boxShadow:'1px 1px 4px 0px #8888', padding:'5px 5px', margin:'5px', borderRadius:'5px', height:'110%'}}>
            
                {/* Title */}
                <h3 className="textDesign1" style={{ marginLeft:'10px', fontSize:'23px'}}>AutoConfig: Offline-Automate</h3>
                
                 <br/> {/*========= Windows Computers ==================== */}

                <h2>Windows</h2>
                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist Directory */}
                    {exists.dirWin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.dirWin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/ -- Exist Directory */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', fontSize:'15px'}}>C:/trackerR324/autoconfig.txt</h3>
                    </div>
            
                </div>

                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist File */}
                    {exists.participantsWin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.participantsWin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/participants.txt -- Exist File */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px', display:'flex'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', overflowWrap:'anywhere', fontSize:'15px'}}>C:/trackerR324/participants.txt</h3>
                    </div>

                    {/* Toogle Button  ParticipantWin */}
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <ToggleBtn ids="checkparticipantsWin" func_onToggle={e=>handleToggleConf(e)} />
                        <span style={{fontSize:'10px', fontWeight:'bold', color:'var(--main-textColor)'}}>Autoload</span>
                    </div>
                    
                </div>

                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist File */}
                    {exists.profileWin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.profileWin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/participants.txt -- Exist File */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px', display:'flex'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', overflowWrap:'anywhere', fontSize:'15px'}}>C:/trackerR324/profile.json</h3>
                    </div>

                    {/* Toggle Button ProfileWin */}
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <ToggleBtn ids="checkprofileWin" func_onToggle={e=>handleToggleConf(e)} />
                        <span style={{fontSize:'10px', fontWeight:'bold', color:'var(--main-textColor)'}}>Autoload</span>
                    </div>
                    
                </div>

                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist File */}
                    {exists.logWin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.logWin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/participants.txt -- Exist File */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px', display:'flex'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', overflowWrap:'anywhere', fontSize:'15px'}}>C:/trackerR324/log.txt</h3>
                    </div>

                    {/* Toggle Button ProfileWin */}
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <ToggleBtn ids="checklogWin" func_onToggle={e=>handleToggleConf(e)} />
                        <span style={{fontSize:'10px', fontWeight:'bold', color:'var(--main-textColor)'}}>Autosave</span>
                    </div>
                    
                </div>

                <br/> {/*============= Linux Computers ================= */}

                <h2>Linux</h2>
                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist Directory */}
                    {exists.dirLin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.dirLin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/ -- Exist Directory */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', fontSize:'15px'}}>/home/trackerR324/autoconfig.txt</h3>
                    </div>
            
                </div>

                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist File */}
                    {exists.participantsLin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.participantsLin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/participants.txt -- Exist File */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px', display:'flex'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', overflowWrap:'anywhere', fontSize:'15px'}}>/home/trackerR324/participants.txt</h3>
                    </div>

                    {/* Toggle Button ParticipantLin */}
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <ToggleBtn ids="checkparticipantsLin" func_onToggle={e=>handleToggleConf(e)} />
                        <span style={{fontSize:'10px', fontWeight:'bold', color:'var(--main-textColor)'}}>Autoload</span>
                    </div>
                    
                </div>

                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist File */}
                    {exists.profileLin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.profileLin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/participants.txt -- Exist File */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px', display:'flex'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', overflowWrap:'anywhere', fontSize:'15px'}}>/home/trackerR324/profile.json</h3>
                    </div>

                    {/* Toggle Button ProfileLin */}
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <ToggleBtn ids="checkprofileLin" func_onToggle={e=>handleToggleConf(e)} />
                        <span style={{fontSize:'10px', fontWeight:'bold', color:'var(--main-textColor)'}}>Autoload</span>
                    </div>
                    
                </div>

                <div style={{display:'flex', width:'100%', alignItems:'center', padding:'2px 5px'}}>
                
                    {/* Checkmark && Cancel Icon -- Exist File */}
                    {exists.logLin && <svg fill="green" height="24" viewBox="0 96 960 960" width="24"><path d="m421 788 305-306-89-91-216 216-103-103-90 91 193 193Zm59 234q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}
                    {!exists.logLin && <svg fill="red" height="24" viewBox="0 96 960 960" width="24"><path d="m346 784 134-134 134 134 74-74-134-134 134-134-74-74-134 134-134-134-74 74 134 134-134 134 74 74Zm134 238q-92.64 0-174.467-34.604-81.828-34.603-142.077-94.852-60.249-60.249-94.852-142.077Q34 668.64 34 576q0-92.896 34.662-174.449 34.663-81.553 95.013-141.968 60.35-60.416 142.076-94.999Q387.476 130 480 130q92.886 0 174.431 34.584 81.544 34.583 141.973 95.012 60.429 60.429 95.012 142Q926 483.167 926 576.083q0 92.917-34.584 174.404-34.583 81.488-94.999 141.838-60.415 60.35-141.968 95.012Q572.896 1022 480 1022Z"/></svg>}

                    {/* C:/trackerR324/participants.txt -- Exist File */}
                    <div style={{flexGrow:1, boxShadow:'1px 1px 4px 0px #8888', padding:'5px', margin:'5px', borderRadius:'5px', display:'flex'}}>
                        <h3 style={{color: 'var(--main-textColor)', marginLeft:'5px', overflowWrap:'anywhere', fontSize:'15px'}}>/home/trackerR324/log.txt</h3>
                    </div>

                    {/* Toggle Button ProfileWin */}
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <ToggleBtn ids="checklogLin" func_onToggle={e=>handleToggleConf(e)} />
                        <span style={{fontSize:'10px', fontWeight:'bold', color:'var(--main-textColor)'}}>Autoload</span>
                    </div>
                    
                </div>


                {/* Save AutoConfig Button */}
                <div onClick={()=>handleSaveAutoConfig()} onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--tetradicGreen)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--analogousGreen)'}
                    style={{padding:'5px', boxShadow:"1px 1px 4px 0px #8888", borderRadius:'5px', border:'2px solid black', backgroundColor:'var(--analogousGreen)', cursor:'pointer', display:'flex', flexWrap:'nowrap', width:'300px', position:'fixed', bottom:'5%',left:'50%', transform:'translateX(-50%)', zIndex:1}}>
                    <h4 className="textDesign1" style={{ margin:'auto', color:'var(--sec-backgroundColor)', fontSize:'20px'}}>Save AutoConfig Settings</h4>
                </div>

            </div>
        </Layout>
    );
};

export default AutoConfig;