console.log('hi i am in background script');

chrome.extension.onConnect.addListener(function(port){
    port.onMessage.addListener(function(domainURL){
        console.log("message received "+domainURL);
        chrome.cookies.getAll({ 'domain' : domainURL }, function(cookie){
            cookie.forEach(element => {
                if(element.name == "sid"){
                    port.postMessage(element.value);
                }
            });
        });
    });
});