"use strict"

function toggle(num, hidden){
    if (hidden){
        document.getElementById('a'+num).style = "display: none";
        document.getElementById('r'+num).style = "display: inline";
    } else {
        document.getElementById('a'+num).style = "display: inline";
        document.getElementById('r'+num).style = "display: none";
    }
}