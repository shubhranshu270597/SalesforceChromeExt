
var conn = null;

document.querySelector("#execute").addEventListener("click",getSession);

function getSession(){
    console.log('enter...');
    if(!document.querySelector('#query').value.trim().length){
        return alert('Unknown error passing query');
    }

    chrome.tabs.query({ active: true, currentWindow: true}, function(tabs){
        console.log(tabs[0]);
        let tab = tabs[0];
        console.log(tab.url);
        if(tab.url && (tab.url.includes('.lightning.salesforce.com') || tab.url.includes('.salesforce.com'))){
            let instanceURL = tab.url.split('.')[0] + '.my.salesforce.com';
            let port = chrome.extension.connect({ name: "Get Session" });
            port.postMessage(instanceURL.replace('https://',''));
            port.onMessage.addListener(function(sessionId){
                console.log('message received '+sessionId);
                conn = new jsforce.Connection({
                    serverUrl: instanceURL,
                    instanceURL: instanceURL,
                    sessionId: sessionId,
                    version: '50.0', 
                });
                executeQuery();
            });
        }else{
            alert('Not a salesforce domain');
        };
    });
}


function executeQuery(){
    let query = document.querySelector('#query').value;
    console.log('query '+query);
    conn.query(query, function(err,result){
        if(err){return alert('error '+err);}
        if(result.records.length){
            let data = result.records.map(currentItem =>{
                let obj = Object.assign({},currentItem);
                delete obj.attributes;
                return obj;
            });
            exportCSV(data);
        }
        console.log(result.records);
    });
}

function exportCSV(data){
    let csvFile = Papa.unparse(data);
    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("Download", "result.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}