import preval from 'babel-plugin-preval/macro';

export function funcAuto_autoConfigLoad(){
    try{
        // Loading the Togle buttons settings
        let loadAutoConfig = preval`
            const fs = require('fs'); 
            if(fs.existsSync('C:/trackerR324/autoconfig.txt')){
                module.exports = fs.readFileSync('C:/trackerR324/autoconfig.txt', 'utf8')
            }else if(fs.existsSync('/home/trackerR324/autoconfig.txt', 'utf8')){
                module.exports = fs.readFileSync('/home/trackerR324/autoconfig.txt', 'utf8')
            };
        `;
        let objAutoConfig = JSON.parse(loadAutoConfig);
        
        return objAutoConfig

    }catch(err){console.log('funcAuto_autoConfigLoad: ' + err)}
};

export function funcAuto_load_Participants_N_Profile(){
    try{
        // Getting the autoconfig.txt settings
        let loadAutoConfig = preval`
        const fs = require('fs'); 
        if(fs.existsSync('C:/trackerR324/autoconfig.txt')){
            module.exports = fs.readFileSync('C:/trackerR324/autoconfig.txt', 'utf8')
        }else if(fs.existsSync('/home/trackerR324/autoconfig.txt', 'utf8')){
            module.exports = fs.readFileSync('/home/trackerR324/autoconfig.txt', 'utf8')
        }
        `;
        
        // Getting the keys and values of autoconfig.txt
        let valArrayAutoConfig = Object.values(JSON.parse(loadAutoConfig));
        let keyArrayAutoConfig = Object.keys(JSON.parse(loadAutoConfig));

        // Getting the keys with true values
        let trueValsAutoConfig = valArrayAutoConfig.map((val, i) => { if (val === true) { return i } }).filter(val => val !== undefined);
        let trueKeysAutoConfig = trueValsAutoConfig.map(index => keyArrayAutoConfig[index]);
        
        // Initializing Variables
        var setPersons = [];
        var setProfile = {};

        // Retreiving and setting the data into global variables
        trueKeysAutoConfig.forEach(item=>{

            if(item === 'participantsWin'){
                let dataParticipants = preval`
                    const fs = require('fs');
                    if(fs.existsSync('C:/trackerR324/participants.txt')){
                        module.exports = fs.readFileSync('C:/trackerR324/participants.txt', 'utf8')
                    };
                `;
                setPersons = JSON.parse(dataParticipants);

            }else if(item==='participantsLin'){
                let dataParticipants = preval`
                    const fs = require('fs');
                    if(fs.existsSync('/home/trackerR324/participants.txt')){
                        module.exports = fs.readFileSync('/home/trackerR324/participants.txt', 'utf8')
                    };
                `;
                setPersons = JSON.parse(dataParticipants);

            }else if(item==='profileWin'){
                let dataProfile = preval`
                    const fs = require('fs');
                    if(fs.existsSync('C:/trackerR324/profile.json')){
                        module.exports = fs.readFileSync('C:/trackerR324/profile.json', 'utf8')
                    };
                `;
                setProfile = JSON.parse(dataProfile);

            }else if(item==='profileLin'){
                let dataProfile = preval`
                    const fs = require('fs');
                    if(fs.existsSync('/home/trackerR324/profile.json')){
                        module.exports = fs.readFileSync('/home/trackerR324/profile.json', 'utf8')
                    };
                `;
                setProfile = JSON.parse(dataProfile);
            };
        
        });

        return {setPersons: setPersons??[], setProfile: setProfile??{}}

    }catch(err){console.log('funcAuto_load_Participants_N_Profile: ' + err)}
};