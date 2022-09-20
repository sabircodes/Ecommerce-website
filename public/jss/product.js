document.querySelector("#cart").addEventListener("click",clicked);
function clicked(){
    
    var myWindow = window.open("/login", "", "width=500, height=500");
    myWindow.blur();
}

