console.log('hi i am in content script');

var intervalid = setInterval(function() {
    let header = document.querySelector(".bPageHeader");
    if(header){
        header.style.backgroundColor = 'blue';
        clearInterval(intervalid);
    }
}, 500);