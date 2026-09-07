"use strict";

function initiate() {
    try{
        document.getElementById('format').onclick = formatText;
        document.getElementById('copy').onclick = copyFeedback;
    }
    catch (error){
        console.log("Help page loading...")
    }
    document.getElementById('light').onclick = lightMode;
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.mode == "light"){
        lightMode();
    } else if (params.mode == "dark"){
        lightMode();
        lightMode();
    }
    if (params.assessor !== null){
        asr = params.assessor.replace("_"," ");
    }
    if (params.hidden == "true"){
        let els = document.getElementsByClassName("checker");
        for (let i = 0; i < els.length; i++){
            els[i].style.display = 'none';
        }
    }
    if (params.date == "true") {
        document.getElementById("date").checked = true;
    }
    if (params.doc == "true") {
        document.getElementById("kal").checked = true;
        document.getElementById("copy").innerHTML = "LMS Format";
    }
}
let asr = ""
window.onload = initiate;
let mode = "default";
let kal2 = false;

function lightMode(){
    if (mode == "default"){
        mode = "light";
        document.body.classList.toggle("light");
        try{
            document.getElementById("helplink").href = "/fb-help.html?mode=light";
        }
        catch (error){
            mode = "light";
        }
    }
    else if (mode == "light"){
        mode = "dark";
        document.body.classList.toggle("light");
        document.body.classList.toggle("dark");
        try{
            document.getElementById("helplink").href = "/fb-help.html?mode=dark";
        }
        catch (error){
            mode = "dark";
        }
    } else {
        mode = "default"
        document.body.classList.toggle("dark");
        try{
            document.getElementById("helplink").href = "/fb-help.html";
        }
        catch (error){
            mode = "default";
        }
    }
}

function formatText() {
    let strings = document.getElementById("textarea").value.split("\n");
    let node;
    let node2;
    let strong;
    let satis;
    let holder;
    let point;
    let things = false;
    let single = false;
    let resubmit = 0;
    let assessor = asr;
    if (assessor == ""){
        assessor = "Jake McAuliffe"
    }
    if (strings.length === 0 || strings[0] == ""){
        alert("Incorrect format!");
    } else {
        let list = document.getElementById("result");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        let jim = document.getElementById("info");
        while (jim.hasChildNodes()) {
            jim.removeChild(jim.firstChild);
        }

        document.getElementById("info").append(document.createTextNode(strings[0]));
        for (let line = 1; line < strings.length; line++){
            if (strings[line] == ""){
                strings.splice(line, 1);
                line--;
            }
        }
        if (/\d$/.test(strings[0])){
            if (/\d(?=.$)/.test(strings[0])){
                resubmit = Number(strings[0].slice(-2));
            }
            else{
                resubmit = Number(strings[0][strings[0].length-1]);
            }
        }
        console.log(`Resubmit count: ${resubmit}`)
        if (strings.length > 1 && strings[1][0] != "Q"){
            things = true;
        }
        if (document.getElementById("assessor").checked){
            assessor = strings.pop();
        }
        if (document.getElementById("date").checked){
            const today  = new Date();
            assessor += ", " + today.toLocaleDateString("en-GB", {weekday: "long", year: "numeric", month: "long", day: "numeric"}).replace(",","")
        }
        let name = strings[0].split(" ")[0].replace("_"," ");
        switch (strings.length) {
            case 1:
                satis = document.createElement("strong");
                node = document.createElement("p");
                if (resubmit > 1){
                    node.appendChild(document.createTextNode(`The combined result of your ${resubmit} attempts is `));
                    satis.appendChild(document.createTextNode("satisfactory."));
                    node.appendChild(satis);
                    node.appendChild(document.createElement("br"));
                    node.appendChild(document.createTextNode(`Good job, ${name}.`));
                }
                else{
                    satis.appendChild(document.createTextNode("Satisfactory."));
                    node.appendChild(satis);
                    node.appendChild(document.createElement("br"));
                    node.appendChild(document.createTextNode(`Well done, ${name}.`));
                }
                node.appendChild(document.createElement("br"));
                node.appendChild(document.createTextNode(assessor));
                document.getElementById("result").appendChild(node);
                break;

            case 2:
                single = true;
            default:
                let phrasing1 = ", but"
                let phrasing2 = "still needs";
                let plural = "";
                if (!single){
                    plural = "s";
                    phrasing2 = "still need";
                }
                node = document.createElement("p");
                strong = document.createElement("strong");
                switch (resubmit) {
                    case 0:
                    case 1:
                        strong.appendChild(document.createTextNode("Resubmit needed."));
                        if (single){
                            phrasing1 = ". Only"
                            phrasing2 = "needs"
                        }
                        else{
                            phrasing2 = "need";
                        }
                        break;
                    case 2:
                        strong.appendChild(document.createTextNode("2nd resubmit needed."));
                        break;
                    case 3:
                        strong.appendChild(document.createTextNode("3rd resubmit needed."));
                        break;
                    default:
                        strong.appendChild(document.createTextNode(`${resubmit}th resubmit needed.`));
                }
                node.appendChild(strong);
                node.appendChild(document.createElement("br"));
                let qs = 0;

                holder = document.createElement("ul");
                holder.style.listStyleType = "none";
                holder.setAttribute('id',"middle");
                for (let i = 1; i < strings.length; i++){
                    if (strings[i] != ""){
                        qs++;
                        point = document.createElement("li");
                        point.appendChild(document.createTextNode(strings[i]));
                        holder.appendChild(point);
                    }
                }
                if (things){
                    node.appendChild(document.createTextNode(`Good job, ${name}${phrasing1} ${qs} thing${plural} ${phrasing2} to be changed:`));
                }
                else {
                    node.appendChild(document.createTextNode(`Good job, ${name}${phrasing1} ${qs} question${plural} ${phrasing2} to be changed:`));
                }
                document.getElementById("result").appendChild(node);
                document.getElementById("result").appendChild(holder);

                node2 = document.createElement("p");
                if (document.getElementById("kal").checked){
                    let bottomtext = ""
                    if (single){
                        bottomtext = "For more detail, check the feedback section under the question in the attached document.";
                    }
                    bottomtext = "For more detail, check the feedback section under each question in the attached document.";
                    if (!kal2){
                        bottomtext = bottomtext.slice(0,-26) + ".";
                    }
                    node2.appendChild(document.createTextNode(bottomtext));
                    document.getElementById("copy").innerHTML = "LMS Format";
                } else {
                    if (!things){
                        if (single){
                            node2.appendChild(document.createTextNode("Please only change your answer to this question and leave all others blank."));
                        }
                        else{
                            node2.appendChild(document.createTextNode("Please only change your answers to these questions and leave all others blank."));
                        }
                        node2.appendChild(document.createElement("br"));
                    }
                    node2.appendChild(document.createTextNode(assessor));
                    document.getElementById("copy").innerHTML = "Copy questions";
                } 
                document.getElementById("result").appendChild(node2);
        }
    }
    copyText("result");
}

function copyFeedback(){ 
    if (document.getElementById("kal").checked){
        kal2 = true;
        formatText();
        kal2 = false;
    }
    else{
        copyText("middle");
    }
}

async function copyText(id) {
    try {
    const div = document.getElementById(id);

    // Get the HTML content of the div
    const htmlContent = div.outerHTML;

    // Create a ClipboardItem with HTML type
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([htmlContent], { type: 'text/html' }),
        'text/plain': new Blob([div.innerText], { type: 'text/plain' }) // fallback
      })
    ]);

  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}