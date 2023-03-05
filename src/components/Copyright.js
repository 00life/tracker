import React from 'react';

function Copyright() {

    const link = encodeURI(document.location.href);//[post-url]
    const title = encodeURI("Thank you for sharing this app"); //[post-title]
    const via = encodeURI("ZeroLife");//[post-username]
    const hash = encodeURI("teachers");//[post-hashtag]


  return (
    <div style={{display:'flex', justifyContent:'center'}}>
        <div className="copyright" style={{
            width:'120%', 
            position: 'fixed', 
            bottom:'0', 
            outline: '1px solid black',
            zIndex:'3',
        }}>

            <div className="shareSocial" style={{
                display: 'flex',
                backgroundColor: 'var(--monochromaticWhite)',
                justifyContent: 'center',
                alignItems: 'center',
                height:'1rem',
            }}>

                <a  rel='noopener' href={'https://www.facebook.com/sharer.php?u='+link}>
                    <img alt='facebookIcon' src={require('./../images/iconFacebook.png')} style={{maxHeight:'15px', width:'auto', margin:'0 5px'}} />
                </a>
                
                &nbsp;

                <a  rel='noopener' href={`https://twitter.com/share?url=${link}&text=${title}&via=${via}&hashtags=${hash}`}>
                    <img alt='twitterIcon' src={require('./../images/iconTwitter.png')} style={{maxHeight:'15px', width:'auto', margin:'0 5px'}}/>
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