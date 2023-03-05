import React from "react";

function LogParticipant({firstname, lastname, timestamp, time, date}){

    const handleDeleteLogEntry = e =>{

    };

    return (
        <div style={{border:'1px solid #8888',margin: '2px 0', borderRadius: '5px', backgroundColor:'var(--monochromaticWhite)', padding:'5px 5px'}}>
        
            <span>{time}</span>
            <span>&nbsp;::&nbsp;</span>
            <span>{date}</span>
            <span>&nbsp;::&nbsp;</span>
            <span>{lastname}&nbsp;{firstname}</span>
            <span style={{float:'right', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <svg data-timestamp={timestamp} onClick={(e)=>handleDeleteLogEntry(e)} height="24" width="24"><path d="M7.2 21.3q-1.05 0-1.75-.7t-.7-1.75V5.9h-1V3.75h5.2V2.675h6.15V3.75h5.2V5.9h-1v12.95q0 1.025-.713 1.737-.712.713-1.737.713Zm9.95-15.4H6.9v12.95q0 .125.088.212.087.088.212.088h9.65q.1 0 .2-.1t.1-.2ZM8.875 17.125h2.15v-9.2h-2.15Zm4.15 0h2.15v-9.2h-2.15ZM6.9 5.9V19.15v-.3Z"/></svg>
            </span>

        </div>
    );
};
export default LogParticipant;