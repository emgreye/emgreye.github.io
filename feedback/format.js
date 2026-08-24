"use strict";

// Room for improvment: ordinal suffix (-st, -th, etc) missing from date and max number of attempts is 9.

function initiate() {
    document.getElementById('format').onclick = formatText;
    document.getElementById('copy').onclick = copyFeedback;
}
window.onload = initiate;

function formatText() {
    let strings = document.getElementById("textarea").value.split("\n");
    let node;
    let node2;
    let strong;
    let holder;
    let point;
    let things = false;
    let resubmit = 0;
    let assessor = "Jake McAuliffe"
    if (strings.length === 0){
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
            resubmit = Number(strings[0][strings[0].length-1]);
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
            assessor += ", " + today.toLocaleDateString("en-GB", {year: "numeric", month: "long", day: "numeric"})
        }
        let name = strings[0].split(" ")[0];
        switch (strings.length) {
            case 1:
                node = document.createElement("p");
                node.appendChild(document.createTextNode("Satisfactory."));
                node.appendChild(document.createElement("br"));
                node.appendChild(document.createTextNode(`Well done, ${name}.`));
                node.appendChild(document.createElement("br"));
                node.appendChild(document.createTextNode(assessor));
                document.getElementById("result").appendChild(node);
                break;

            case 2:
                node = document.createElement("p");
                strong = document.createElement("strong");
                switch (resubmit) {
                    case 0:
                    case 1:
                        strong.appendChild(document.createTextNode("Resubmit needed."));
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
                if (things){
                    node.appendChild(document.createTextNode(`Good job, ${name}. Only one thing needs to be changed:`));
                }
                else{
                    node.appendChild(document.createTextNode(`Good job, ${name}. Only one question needs to be changed:`));
                }
                document.getElementById("result").appendChild(node);

                holder = document.createElement("ul");
                holder.style.listStyleType = "none";
                holder.setAttribute('id',"middle");
                point = document.createElement("li");
                point.appendChild(document.createTextNode(strings[1]));
                holder.appendChild(point);
                document.getElementById("result").appendChild(holder);

                node2 = document.createElement("p");
                if (!things){
                    node2.appendChild(document.createTextNode("Please only change your answer to this question and leave all others blank."));
                    node2.appendChild(document.createElement("br"));
                }
                node2.appendChild(document.createTextNode(assessor));
                document.getElementById("result").appendChild(node2);
                break;

            default:
                node = document.createElement("p");
                strong = document.createElement("strong");
                switch (resubmit) {
                    case 0:
                    case 1:
                        strong.appendChild(document.createTextNode("Resubmit needed."));
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
                    node.appendChild(document.createTextNode(`Good job, ${name}, but ${qs} things need to be changed:`));
                }
                else {
                    node.appendChild(document.createTextNode(`Good job, ${name}, but ${qs} questions need to be changed:`));
                }
                document.getElementById("result").appendChild(node);
                document.getElementById("result").appendChild(holder);

                node2 = document.createElement("p");
                if (!things){
                    node2.appendChild(document.createTextNode("Please only change your answers to these questions and leave all others blank."));
                    node2.appendChild(document.createElement("br"));
                }
                node2.appendChild(document.createTextNode(assessor));
                document.getElementById("result").appendChild(node2);
        }
    }
    copyText("result");
}

function copyFeedback(){
    copyText("middle");
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