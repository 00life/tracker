import React from 'react';

function Copyright() {

    const link = encodeURI(document.location.href);//[post-url]
    const title = encodeURI("Thank you for sharing this app"); //[post-title]
    const via = encodeURI("ZeroLife");//[post-username]
    const hash = encodeURI("teachers");//[post-hashtag]


  return (
    <div style={{display:'flex', justifyContent:'center'}}>
        <div className="copyright" style={{
            width:'90%', 
            position: 'fixed', 
            bottom:'0', 
            outline: '1px solid black',
            zIndex:'3'
        }}>

            <div className="shareSocial" style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 248, 220,0.5)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <a target="_blank" href={'https://www.facebook.com/sharer.php?u='+link}>
                    <img src={require('./../images/iconFacebook.png')} style={{maxHeight:'20px', width:'auto'}} />
                </a>
                
                &nbsp;

                <a target="_blank" href={`https://twitter.com/share?url=${link}&text=${title}&via=${via}&hashtags=${hash}`}>
                    <img src={require('./../images/iconTwitter.png')} style={{maxHeight:'20px', width:'auto'}}/>
                </a>
            
            </div>

            <div style={{
                color: 'white',
                backgroundColor:'black',
                fontSize: 'xx-small',
                border: '1 px solid rgba(255, 255, 255, 1)',
                textAlign:'center'
            }}>

                Copyright © <span id="year">{new Date().getFullYear()}</span> Tracker-R324 Reza Tahirkheli.  All Rights Reserved. 
            
            </div>

        </div>
    </div>
  )
}

export default Copyright