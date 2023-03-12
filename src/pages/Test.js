import React from 'react';
import { auth } from '../context/Firebase';
import preval from 'babel-plugin-preval/macro';


function Test() {

  const handleClick = ()=>{
    
    try{
      const greeting = preval`
        const fs = require('fs');
        module.exports = fs.readFileSync('./books.txt', 'utf8');
        `
      console.log(greeting);
    }catch{console.log('error')};

    try{
      let x = 'This is another another another test'
      preval`
        const fs = require('fs');
        module.exports = fs.writeFileSync('./books.txt', '${x}', 'utf8');
      `
    }catch(err){console.log(err)}
  }

  const handleClick2 = ()=>{

    let y = preval`
        const fs = require('fs');
        module.exports = fs.existsSync('C:/Users/R324/Desktop/Coding Projects/React/tracker/books.txt');
      `
    console.log(y);
  }

  const handleClick3 =()=>{
   
      const greeting = preval`
        const fs = require('fs');
        module.exports = fs.readFileSync(require.resolve('./test.txt'), 'utf8');
        `
      console.log(greeting);
   

  };

  const handleClick4 =()=>{
    console.log('test')
    preval`
      const fs = require('fs');
      fs.appendFileSync(require.resolve('./test.txt'),'This is another test man!' ,'utf8');
    `
  };

  return(

    <div>
      
      <button onClick={()=>handleClick()} 
        style={{fontSize:'30px'}}>
        Click me
      </button>

      <br/>
      <br/>

      <button onClick={()=>handleClick2()} 
        style={{fontSize:'30px'}}>
        Click me 2
      </button>

      <br/>
      <br/>

      <button onClick={()=>handleClick3()} 
        style={{fontSize:'30px'}}>
        Click me 3
      </button>

      <br/>
      <br/>

      <button onClick={()=>handleClick4()} 
        style={{fontSize:'30px'}}>
        Click me 4
      </button>

    </div>
    
  );
};

export default Test;