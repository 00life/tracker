import React, { useState, useEffect, createElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

import { func_loaddata, func_savedata } from './Functions_1';
import { func2_stringDateName } from './Functions_2';
import Copyright from '../components/Copyright';
import './Snackbar.css';
import './Dropdown.css';


function Layout({children}) {
    const { func_logout, func_snackbar, logArray, setLogArray, authstatus, reference } = useAuth();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState('');
    const [svgColor, setSvgColor] = useState('');

    const handleButtonEvent = e => {
        try{
            let current = reference.current.querySelectorAll('data')[0].value
            let last = sessionStorage.getItem('lastpage');
            if(last!==current){sessionStorage.setItem('lastpage',current)};
            let destination = e.currentTarget.dataset.dest;
            navigate(destination);
        }catch(err){console.log('handleButtonEvent:'+ err)} 
    };

    const handleCheckboxMenu = e => {
        if(e.currentTarget.checked){
            setSvgColor('blue');
            reference.current.querySelector("#backgroundLabel").style.display = 'block';
        }else{
            setSvgColor('');
            reference.current.querySelector("#backgroundLabel").style.display = 'none';
        };
    };

    const handleSaveLogCSV = () => {
        var stringData =''
        for(let i=logArray.length - 1; i > -1; i--){
            let direction = logArray[i].number % 2 === 0 ? 'out':'back';
            let duration = logArray[i].duration;
            let time = logArray[i].time;
            let date = logArray[i].date;
            let lastname = logArray[i].lastname;
            let firstname = logArray[i].firstname;
            stringData +=`\r\n,${direction}, ${duration}, ${time}, ${date}, ${lastname}, ${firstname}, \r\n   `
        };
        let saveName = `log_${func2_stringDateName()}.csv`
        func_savedata(stringData, saveName)
        reference.current.querySelector('#checkbox-link').checked = false;
        setSvgColor('');
    };

    const handleSaveLogJSON = () => {
        let saveName = `log_${func2_stringDateName()}.json`
        func_savedata(logArray, saveName);
        reference.current.querySelector('#checkbox-link').checked = false;
        setSvgColor('');
    };

    const handleLoadLog = () => {
        let elem = document.createElement('input');
        elem.setAttribute('type','file');
        elem.click()
        elem.onchange = e =>{
            let callback = data => setLogArray(data);
            func_loaddata(e.currentTarget, callback)
        };
        reference.current.querySelector('#checkbox-link').checked = false;
        setSvgColor('');
    };


    useEffect(()=>{
        try{
            setCurrentPage(reference?.current?.querySelectorAll('data')[0].value);
            reference.current.querySelector('#home').style.pointerEvents = (currentPage==='/') ? 'none':'default';
            reference.current.querySelector('#profile').style.pointerEvents = (currentPage==='/profile') ? 'none':'default';
            reference.current.querySelector('#barcode').style.pointerEvents = (currentPage==='/barcode') ? 'none':'default';
            reference.current.querySelector('#request').style.pointerEvents = (currentPage==='/request') ? 'none':'default';
            reference.current.querySelector('#addperson').style.pointerEvents = (currentPage==='/addperson') ? 'none':'default';
            reference.current.querySelector('#login').style.pointerEvents = (currentPage==='/login') ? 'none':'default';
            reference.current.querySelector('#editperson').style.pointerEvents = (currentPage==='/editperson') ? 'none':'default';
            reference.current.querySelector('#addlist').style.pointerEvents = (currentPage==='/addlist') ? 'none':'default';
        }catch{};
        return ()=>{}
    },[currentPage, reference])

  return (
    <div ref={reference} style={{backgroundColor:'var(--main-backgroundColor)', height:'100vh', display:'flex', flexDirection:'column'}}>
        <label id="backgroundLabel" htmlFor='checkbox-link' style={{display:'none',position:'absolute',backgroundColor:'transparent', width:'100%', height:'100%', zIndex:1}}></label>
        <nav style={{display:'flex', border:'2px solid grey', backgroundImage: 'linear-gradient(to bottom right, cornsilk, white)', marginBottom:"3px", borderRadius:"5px", boxShadow:"var(--main-boxShadow)"}}>
            <table style={{width:'100%'}}>
                <tbody>
                    <tr>
                        <td style={{width:'100%', display:'flex', alignItems:'center'}}>
                            
                            {/* App Logo Image */}
                            <img src={require("./../images/logo.png")} alt="logo" height="50px" width="max-width"
                                style={{filter:'drop-shadow(2px 2px 0px black)'}}/>
                            
                            {/* Online-Offline Status Bubble */}
                            <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} id="indicator-online" width="24px" height="24px" viewBox="0 0 24 24" fill={!authstatus?"none":"palegreen"} >
                                <path opacity="0.15" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#001A72"/>
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="black" strokeWidth="1.5"/>
                            </svg>

                        </td>
                        <td style={{width:"90px"}}>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                                
                                {/* Last Page Button */}
                                <svg onClick={()=>navigate(sessionStorage.getItem('lastpage'))} style={{filter:'drop-shadow(2px 2px 1px #8888)', boxShadow:"var(--main-boxShadow)", float:"right", borderRadius:"5px", cursor:'pointer'}} height="40" width="40"><path d="M27.208 37.833 9.333 20 27.208 2.167l3.667 3.708L16.75 20l14.125 14.125Z"/></svg>
                                
                                {/* Account Profile Button */}
                                <svg id="profile" onClick={()=>navigate('/profile')} style={{filter:'drop-shadow(2px 2px 1px #8888)', boxShadow:"var(--main-boxShadow)", float:"right", margin:"0px 10px", borderRadius:"5px", cursor:'pointer'}} fill={currentPage==='/profile'?'blue':''} height="40" width="40"><path d="M9.583 28.542q2.417-1.584 4.979-2.396 2.563-.813 5.438-.813 2.875 0 5.521.855 2.646.854 4.937 2.354 1.584-2.125 2.292-4.146.708-2.021.708-4.396 0-5.667-3.896-9.562Q25.667 6.542 20 6.542t-9.562 3.896Q6.542 14.333 6.542 20q0 2.417.687 4.417.688 2 2.354 4.125ZM20 21.75q-2.542 0-4.312-1.75-1.771-1.75-1.771-4.292 0-2.541 1.771-4.312Q17.458 9.625 20 9.625q2.542 0 4.312 1.771 1.771 1.771 1.771 4.312 0 2.542-1.771 4.292-1.77 1.75-4.312 1.75Zm0 16.125q-3.667 0-6.938-1.396-3.27-1.396-5.729-3.854-2.458-2.458-3.833-5.687Q2.125 23.708 2.125 20q0-3.708 1.396-6.958t3.854-5.688Q9.833 4.917 13.062 3.5q3.23-1.417 6.98-1.417 3.666 0 6.916 1.417 3.25 1.417 5.688 3.854 2.437 2.438 3.854 5.688 1.417 3.25 1.417 6.958T36.5 26.938q-1.417 3.229-3.854 5.687-2.438 2.458-5.688 3.854-3.25 1.396-6.958 1.396Z"/></svg>
                                
                                {/* Dropdown Menu */}
                                <div className="dropdown"  style={{position:'relative'}}>
                                    
                                    {/* Menu Button */}
                                    <label htmlFor='checkbox-link'><svg style={{filter:'drop-shadow(2px 2px 1px #8888)', boxShadow:"var(--main-boxShadow)", float:"right", borderRadius:"5px", cursor:'pointer'}} height="40" width="40" stroke={svgColor} fill={svgColor}><path d="M4.167 31.333v-4.416h31.666v4.416Zm0-9.125v-4.416h31.666v4.416Zm0-9.125V8.625h31.666v4.458Z"/></svg></label>
                                    <input id="checkbox-link" type='checkbox' onChange={e=>handleCheckboxMenu(e)} style={{display:'none'}}/>
                                    
                                    {/* Dropdown Buttons */}
                                    <div className='dropdown-menu' style={{position:'absolute', borderRadius:'5px', padding:'2px', top:'130%', right:0, boxShadow:'0px 2px 5px 0px #8888', backgroundColor:'white', zIndex:1}}>
                                        
                                        {/* Dropdown Button to Participant */}
                                        <div onClick={()=>navigate('/participants')} onMouseOver={e=>e.currentTarget.style.backgroundColor = 'var(--thir-backgroundColor)'} onMouseOut={e=>e.currentTarget.style.backgroundColor = 'var(--sec-backgroundColor)'}
                                            style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',width:'100%', backgroundColor:'var(--sec-backgroundColor)', boxShadow:'var(--main-boxShadow)', cursor:'pointer', padding:'5px', borderRadius:'5px'}}>
                                            <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M6.075 23.9q-1.825 0-3.113-1.288-1.287-1.287-1.287-3.112v-4.15h3.4V1.125L6.85 2.85l1.7-1.725 1.725 1.725L12 1.125l1.7 1.725 1.725-1.725 1.7 1.725 1.7-1.725L20.55 2.85l1.775-1.725V19.5q0 1.825-1.287 3.112Q19.75 23.9 17.925 23.9Zm11.85-3.4q.425 0 .713-.3.287-.3.287-.7V5.7H8.475v9.65h8.45v4.15q0 .4.287.7.288.3.713.3ZM9.4 10.05V7.8h5.475v2.25Zm0 3.175v-2.25h5.475v2.25Zm7.45-3.175q-.45 0-.788-.325-.337-.325-.337-.8 0-.45.337-.788.338-.337.788-.337.475 0 .8.337.325.338.325.788 0 .475-.325.8-.325.325-.8.325Zm0 3.175q-.45 0-.788-.325-.337-.325-.337-.8 0-.475.337-.8.338-.325.788-.325.475 0 .8.325.325.325.325.8 0 .475-.325.8-.325.325-.8.325ZM6.075 20.5h7.45v-1.75h-8.45v.75q0 .4.288.7.287.3.712.3Zm-1 0v-1.75 1.75Z"/></svg>
                                            <div style={{fontSize:'10px'}}>Participants</div>
                                        </div>

                                        {/* Dropdown Button to Save as .CSV */}
                                        <div onClick={()=>handleSaveLogCSV()}  onMouseOver={e=>e.currentTarget.style.backgroundColor = 'var(--thir-backgroundColor)'} onMouseOut={e=>e.currentTarget.style.backgroundColor = 'var(--sec-backgroundColor)'}
                                            style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',width:'100%', backgroundColor:'var(--sec-backgroundColor)', boxShadow:'var(--main-boxShadow)', cursor:'pointer', padding:'5px', borderRadius:'5px', marginTop:'5px'}}>
                                            <div style={{fontSize:'10px'}}>Save Log</div>
                                            <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M22.15 6.525V18.75q0 1.425-.987 2.413-.988.987-2.413.987H5.25q-1.425 0-2.412-.987-.988-.988-.988-2.413V5.25q0-1.425.988-2.413.987-.987 2.412-.987h12.225Zm-3.4 1.425-2.7-2.7H5.25v13.5h13.5ZM12 17.825q1.3 0 2.213-.912.912-.913.912-2.213t-.912-2.213q-.913-.912-2.213-.912t-2.212.912q-.913.913-.913 2.213t.913 2.213q.912.912 2.212.912Zm-5.825-7.4h9.3v-4.25h-9.3ZM5.25 7.95v10.8-13.5Z"/></svg>
                                            <div style={{fontSize:'10px'}}>.CSV</div>
                                        </div>

                                        {/* Dropdown Button to Save as .JSON */}
                                        <div onClick={()=>handleSaveLogJSON()} onMouseOver={e=>e.currentTarget.style.backgroundColor = 'var(--thir-backgroundColor)'} onMouseOut={e=>e.currentTarget.style.backgroundColor = 'var(--sec-backgroundColor)'}
                                            style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',width:'100%', backgroundColor:'var(--sec-backgroundColor)', boxShadow:'var(--main-boxShadow)', cursor:'pointer', padding:'5px', borderRadius:'5px', marginTop:'5px'}}>
                                            <div style={{fontSize:'10px'}}>Save Log</div>
                                            <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M22.15 6.525V18.75q0 1.425-.987 2.413-.988.987-2.413.987H5.25q-1.425 0-2.412-.987-.988-.988-.988-2.413V5.25q0-1.425.988-2.413.987-.987 2.412-.987h12.225Zm-3.4 1.425-2.7-2.7H5.25v13.5h13.5ZM12 17.825q1.3 0 2.213-.912.912-.913.912-2.213t-.912-2.213q-.913-.912-2.213-.912t-2.212.912q-.913.913-.913 2.213t.913 2.213q.912.912 2.212.912Zm-5.825-7.4h9.3v-4.25h-9.3ZM5.25 7.95v10.8-13.5Z"/></svg>
                                            <div style={{fontSize:'10px'}}>.JSON</div>
                                        </div>

                                        {/* Dropdown Button to Load .JSON */}
                                        <div onClick={()=>handleLoadLog()} onMouseOver={e=>e.currentTarget.style.backgroundColor = 'var(--thir-backgroundColor)'} onMouseOut={e=>e.currentTarget.style.backgroundColor = 'var(--sec-backgroundColor)'}
                                            style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',width:'100%', backgroundColor:'var(--sec-backgroundColor)', boxShadow:'var(--main-boxShadow)', cursor:'pointer', padding:'5px', borderRadius:'5px', marginTop:'5px'}}>
                                            <div style={{fontSize:'10px'}}>Load Log</div>
                                            <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M10.875 19.1H13.1v-4.35l1.6 1.6 1.525-1.525-4.25-4.25-4.25 4.25 1.55 1.525 1.6-1.6ZM6.25 23.15q-1.4 0-2.4-.987-1-.988-1-2.413V4.25q0-1.425 1-2.413 1-.987 2.4-.987h7.975l6.925 6.875V19.75q0 1.425-1 2.413-1 .987-2.4.987ZM12.475 9.5V4.25H6.25v15.5h11.5V9.5ZM6.25 4.25V9.5 4.25v15.5-15.5Z"/></svg>
                                            <div style={{fontSize:'10px'}}>.JSON</div>
                                        </div>

                                        {/* Dropdown Button to Load Profile */}
                                        <div onClick={()=>{}} onMouseOver={e=>e.currentTarget.style.backgroundColor = 'var(--thir-backgroundColor)'} onMouseOut={e=>e.currentTarget.style.backgroundColor = 'var(--sec-backgroundColor)'}
                                            style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',width:'100%', backgroundColor:'var(--sec-backgroundColor)', boxShadow:'var(--main-boxShadow)', cursor:'pointer', padding:'5px', borderRadius:'5px', marginTop:'5px'}}>
                                            <div style={{fontSize:'10px'}}>Load</div>
                                            <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M10.875 19.1H13.1v-4.35l1.6 1.6 1.525-1.525-4.25-4.25-4.25 4.25 1.55 1.525 1.6-1.6ZM6.25 23.15q-1.4 0-2.4-.987-1-.988-1-2.413V4.25q0-1.425 1-2.413 1-.987 2.4-.987h7.975l6.925 6.875V19.75q0 1.425-1 2.413-1 .987-2.4.987ZM12.475 9.5V4.25H6.25v15.5h11.5V9.5ZM6.25 4.25V9.5 4.25v15.5-15.5Z"/></svg>
                                            <div style={{fontSize:'10px'}}>Profile</div>
                                        </div>
                                    
                                    </div>
                                </div>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>    
        </nav>

        <nav style={{display:"flex",boxShadow:"var(--main-boxShadow)", height:"50px", backgroundImage: 'linear-gradient(to bottom right, white, cornsilk)', border:"2px solid grey", borderRadius:"5px", alignItems:"center", justifyContent:"space-between", padding:"8px"}}>
            
            {/* Home Button */}
            <button id="home" data-dest="/" onClick={(e)=>handleButtonEvent(e)} style={{boxShadow:"var(--main-boxShadow)", height:"40px", width:"40px", cursor:'pointer'}}>
                <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} fill={currentPage==='/'?'blue':''} height="24" width="24"><path d="M2.925 22.1V8.475L12 1.65l9.075 6.825V22.1H14.3v-8.3H9.7v8.3Z"/></svg>
            </button>

            {/* Barcode Button */}
            <button id="barcode" data-dest="/barcode" onClick={(e)=>handleButtonEvent(e)} style={{boxShadow:"var(--main-boxShadow)", height:"40px", width:"40px", cursor:'pointer'}}>
                <svg  style={{filter:'drop-shadow(2px 2px 1px #8888)', cursor:'pointer'}} fill={currentPage==='/barcode'?'blue':''} height="24" width="24"><path d="M13.825 24.3v-2.825h2.825V24.3ZM11 21.475v-6.65h2.825v6.65Zm10.275-4.025V12H24.1v5.45ZM18.45 12V9.175h2.825V12ZM2.525 14.825V12H5.35v2.825ZM-.3 12V9.175h2.825V12ZM12 2.525V-.3h2.825v2.825ZM2.175 5.7H5.7V2.175H2.175ZM-.3 8.175V-.3h8.475v8.475Zm2.475 13.65H5.7V18.3H2.175ZM-.3 24.3v-8.475h8.475V24.3ZM18.3 5.7h3.525V2.175H18.3Zm-2.475 2.475V-.3H24.3v8.475ZM18.85 24.3v-4.025H16.2V17.45h5.075v4.025H24.1V24.3Zm-5.025-9.475V12h4.625v2.825Zm-5.65 0V12H5.35V9.175h8.475V12H11v2.825Zm1-6.65v-5.65H12V5.55h2.825v2.625ZM3.15 4.725V3.15h1.575v1.575Zm0 16.125v-1.575h1.575v1.575ZM19.275 4.725V3.15h1.575v1.575Z"/></svg>
            </button>

            {/* Request Button */}
            <button id="request" data-dest="/request" onClick={(e)=>handleButtonEvent(e)} style={{pointerboxShadow:"var(--main-boxShadow)", height:"40px", width:"40px", cursor:'pointer'}}>
                <svg  style={{filter:'drop-shadow(2px 2px 1px #8888)'}} fill={currentPage==='/request'?'blue':''} height="24" width="24"><path d="M.5 17.825V1.7q0-.6.413-1Q1.325.3 1.925.3H16.05q.625 0 1.025.4.4.4.4 1v10.05q0 .625-.413 1.025-.412.4-1.012.4H5.15ZM6.9 19.2q-.625 0-1.025-.412-.4-.413-.4-1.038v-2.575h14v-9.85h2.6q.6 0 1.012.4.413.4.413 1V23.75l-4.575-4.55Zm7.5-15.825H3.575V10.6l.5-.5H14.4Zm-10.825 0V10.6Z"/></svg>
            </button>

            {/* Add Person Button */}
            <button id="addperson" data-dest="/addperson" onClick={(e)=>handleButtonEvent(e)} style={{boxShadow:"var(--main-boxShadow)", height:"40px", width:"40px", cursor:'pointer'}}>
                <svg  style={{filter:'drop-shadow(2px 2px 1px #8888)'}} fill={currentPage==='/addperson'?'blue':''} height="24" width="24"><path d="M18.45 13v-2.825h-2.825v-2.65h2.825v-2.8h2.65v2.8h2.8v2.65h-2.8V13Zm-9.375-1.55q-2.125 0-3.587-1.475-1.463-1.475-1.463-3.6 0-2.1 1.463-3.55 1.462-1.45 3.587-1.45t3.588 1.45q1.462 1.45 1.462 3.575 0 2.1-1.462 3.575Q11.2 11.45 9.075 11.45Zm-9.15 10.4v-3.975q0-1.175.6-2.113.6-.937 1.575-1.437 1.65-.85 3.4-1.275 1.75-.425 3.575-.425 1.85 0 3.6.425t3.375 1.25q.975.5 1.575 1.438.6.937.6 2.137v3.975Zm3.4-3.4h11.5V18q0-.25-.125-.45t-.325-.275q-1.2-.6-2.55-.925-1.35-.325-2.75-.325-1.375 0-2.763.325-1.387.325-2.537.925-.2.075-.325.275t-.125.45Zm5.75-10.4q.675 0 1.163-.488.487-.487.487-1.162 0-.675-.487-1.163-.488-.487-1.163-.487t-1.162.487q-.488.488-.488 1.163t.488 1.162q.487.488 1.162.488Zm0-1.65Zm0 12.05Z"/></svg>
            </button> 

            {/* Login && Logout Button */}
            <div>
                
                {!authstatus && <button id="login" onClick={()=>navigate('/login')} style={{boxShadow:"var(--main-boxShadow)", height:"40px", width:"40px", cursor:'pointer'}}>
                    <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} width="30px" height="30px" viewBox="0 0 256 256" id="Flat" fill={currentPage==='/login'?'blue':''}>
                    <path d="M144.48633,136.48438l-41.98926,42a12.0001,12.0001,0,0,1-16.97266-16.96875L107.03467,140H24a12,12,0,0,1,0-24h83.03467L85.52441,94.48438a12.0001,12.0001,0,0,1,16.97266-16.96875l41.98926,42A12.00093,12.00093,0,0,1,144.48633,136.48438ZM192,28H136a12,12,0,0,0,0,24h52V204H136a12,12,0,0,0,0,24h56a20.02229,20.02229,0,0,0,20-20V48A20.02229,20.02229,0,0,0,192,28Z"/>
                    </svg>
                </button>}

                {authstatus && <button onClick={()=>{func_logout();func_snackbar(reference, 'Logout Successful')}} style={{boxShadow:"var(--main-boxShadow)", height:"40px", width:"40px", cursor:'pointer'}}>
                    <svg style={{filter:'drop-shadow(2px 2px 1px #8888)', cursor:'pointer'}} width="30px" height="30px" viewBox="0 0 256 256" id="Flat">
                    <path d="M224.48633,136.48438l-41.98926,42a12.0001,12.0001,0,0,1-16.97266-16.96876L187.03467,140H104a12,12,0,0,1,0-24h83.03467L165.52441,94.48438a12.0001,12.0001,0,0,1,16.97266-16.96876l41.98926,42A12.00094,12.00094,0,0,1,224.48633,136.48438ZM104,204H52V52h52a12,12,0,0,0,0-24H48A20.02229,20.02229,0,0,0,28,48V208a20.02229,20.02229,0,0,0,20,20h56a12,12,0,0,0,0-24Z"/>
                    </svg>
                </button>}

            </div>
        </nav>
        
        {/* Children Pages Insert */}
        <div style={{flexGrow:1, position:'relative'}}>
            <div id='alertBorder' style={{display:'none', backgroundColor:'palegreen', opacity:'0.25', position:'absolute', width:'100%', height:'100%'}}>&nbsp;</div>
            {children}
        </div>

        {/* Snackbar Notification */}
        <div id="snackbar" st={{zIndex:"100", borderRadius:"20px"}}>Some text some message..</div>

        {/* <Copyright /> */}
    </div>
  )
}

export default Layout