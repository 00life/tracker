import { func_dataURItoBlob } from "./Functions_1";

export function func_config(setConfig){
// Load the autoload toggle button to its previous settings
    try{
        let autoConfig = JSON.parse(window?.localStorage?.getItem('config'));  
        setConfig({...autoConfig, auto:!autoConfig.auto});
    }catch(err){console.log('func_config:'+err)};
};

export function func_autoLoadPersons(persons, setPersons, func_snackbar, reference){
// Load persons at startup from file location
    try{
        let autoConfig = JSON.parse(window?.localStorage?.getItem('config'));
        if(persons.length === 0 && !autoConfig.auto){
            let blob = func_dataURItoBlob(autoConfig.persons);
            
            var reader = new FileReader();
            reader.onloadend = function(){
                var load = JSON.parse(reader.result);
                setPersons(load);
            };
            reader.readAsText(blob);
        };
    }catch(err){
        func_snackbar(reference,'Load at least once to set autoload')
        console.log('func_autoLoadPersons:'+err)
    }
};