import React, {useState} from 'react';
import Layout from '../context/Layout';
import { useAuth } from '../context/AuthContext';
import { func_savedata, func_loaddata, func_modalview, func_generateQR, func_convertFrom24To12Format, func_snackbar } from '../context/Functions_1';
import ToggleBtn from '../components/ToggleBtn';
import ModalView from '../components/ModalView';
import Avatar from '../components/Avatar';
import PartProfile from './PartProfile';
import InputBar from '../components/inputBar';

function Participants() {

  const { persons, setPersons, config, setConfig ,reference } = useAuth();

  const [filterArray, setFilterArray] = useState(undefined);

  const func_onToggle=e=>{
    setConfig(prev=>({...prev, auto:!config.auto}));
    window.localStorage.setItem('config',JSON.stringify(config));
    (e.currentTarget.checked)
      ? func_snackbar(reference, 'auto is enabled')
      : func_snackbar(reference, 'auto is disabled')
  };

  const handlePartProfile = async e =>{
    func_modalview(reference, '#myModal')
    let hash = e.currentTarget.dataset.hash;
    let personData = persons.filter(person=>person.hash===hash)[0];
    let showEmail = !personData.email?'': '('+personData.email+')';
    reference.current.querySelector('.modal-header').children[1].innerHTML = personData?.lastname+', '+personData?.firstname+' '+showEmail;
    reference.current.querySelector('.modal-footer').children[0].dataset.hash = hash;

    let partProfile = reference.current.querySelector('#partProfile');
    partProfile.src = await func_generateQR(hash,'base64');

    let html = `
      <table border="1">
        <tr>
          <th style="padding:5px">DETAILS<th/>
          <th style="padding:5px">START-TIME</th>
          <th style="padding:5px">END-TIME</th>
        </tr>
        ${personData.schedule.map(item=>(`
          <tr style="text-align:center">
            <th style="color:var(--main-textColor); word-wrap: break-word">${item.details}<th/>
            <td>${(!item?.starttime)?'':func_convertFrom24To12Format(item.starttime)}</td>
            <td>${(!item?.endtime)?'':func_convertFrom24To12Format(item.endtime)}</td>
          </tr>
        `)).join('')}
        
      <table>
    `
    reference.current.querySelector('#schedule').innerHTML = html;
   
    let JsBarcode = require('jsbarcode');
    let { createCanvas } = require("canvas");
    let canvas = createCanvas();
    JsBarcode(canvas, hash);
    let base64 = canvas.toDataURL('image/jpeg',1);
    reference.current.querySelector('#partBar').src = base64
  };

  const handleSearch = e=>{
    let cleanLetter = e.replace(/[^\w\s]/gi, '')
    let filterFirstnameArray = persons.filter(item=>item.firstname.toLowerCase().match('^'+cleanLetter));
    let filterLastnameArray = persons.filter(item=>item.lastname.toLowerCase().match('^'+cleanLetter));
    let filterFinal = [...new Set([...filterFirstnameArray,...filterLastnameArray])];
    setFilterArray([...filterFinal]);
   
  };

  return (
    <Layout>
        <data value='/participants'></data>

        <div>

          <ModalView ids={"myModal"} header={'Your Name'} footer={'Edit'} >
            <PartProfile />
          </ModalView>
          
          <div style={{boxShadow:'1px 1px 4px 0px #8888', margin:'5px', borderRadius:'5px', padding:'5px', display:'flex', justifyContent:"space-evenly", alignItems:'center', backgroundColor:'var(--sec-backgroundColor)'}}>

            <div style={{display:'flex', justifyContent:'center', flexGrow:'1'}}>
              <div style={{width:'100%'}}>
                <InputBar ids="searchParticipant" type={"text"} placeholder={"search"} func_onChange={handleSearch} required={false}/>
              </div>
            </div>

            <div style={{display:'flex', flexWrap:'nowrap'}}>

              <button onClick={()=>func_savedata(persons,'participants')} type="button" style={{boxShadow:'1px 1px 4px 0px #8888', padding:'2px', marginLeft:'5px'}}>
                <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M22.15 6.525V18.75q0 1.425-.987 2.413-.988.987-2.413.987H5.25q-1.425 0-2.412-.987-.988-.988-.988-2.413V5.25q0-1.425.988-2.413.987-.987 2.412-.987h12.225Zm-3.4 1.425-2.7-2.7H5.25v13.5h13.5ZM12 17.825q1.3 0 2.213-.912.912-.913.912-2.213t-.912-2.213q-.913-.912-2.213-.912t-2.212.912q-.913.913-.913 2.213t.913 2.213q.912.912 2.212.912Zm-5.825-7.4h9.3v-4.25h-9.3ZM5.25 7.95v10.8-13.5Z"/></svg>
              </button>

              <button onClick={e=>e?.currentTarget?.querySelector('#btn-loaddata').click()} type="button" style={{boxShadow:'1px 1px 4px 0px #8888', padding:'2px', marginLeft:'5px'}}>
                <svg style={{filter:'drop-shadow(2px 2px 1px #8888)'}} height="24" width="24"><path d="M10.875 19.1H13.1v-4.35l1.6 1.6 1.525-1.525-4.25-4.25-4.25 4.25 1.55 1.525 1.6-1.6ZM6.25 23.15q-1.4 0-2.4-.987-1-.988-1-2.413V4.25q0-1.425 1-2.413 1-.987 2.4-.987h7.975l6.925 6.875V19.75q0 1.425-1 2.413-1 .987-2.4.987ZM12.475 9.5V4.25H6.25v15.5h11.5V9.5ZM6.25 4.25V9.5 4.25v15.5-15.5Z"/></svg>
                <input id="btn-loaddata" type="file" onChange={e=>func_loaddata(e.currentTarget, setPersons)} style={{display:'none'}}/>
              </button>

              <div style={{marginLeft:'5px', display:"flex", flexDirection:"column", alignItems:"center"}}>
                <ToggleBtn func_onToggle={func_onToggle} check={config.auto}/>
                <h6 style={{color:'var(--main-textColor:)'}}>Auto</h6>
              </div>
              
            </div>

          </div>

          <div style={{display:'flex', alignContent:'flex-start', justifyContent:'space-evenly', flexWrap:'wrap',caretColor:'rgba(0,0,0,0)', margin:'5px', boxShadow:'1px 1px 4px 0px #8888', borderRadius:'5px'}}>
            
            {persons.length>0 && (()=>filterArray??persons)().map((p,i)=>{return(
              
              <Avatar key={i} 
                hash={p.hash} lastname={p.lastname} firstname={p.firstname} base64={p.base64}
                func_function={handlePartProfile} 
              />

            )})}

          </div>

        </div>
    </Layout>
  )
}

export default Participants