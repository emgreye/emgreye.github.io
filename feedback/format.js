"use strict";
function initiate() {
    document.getElementById('format').onclick = formatText;
    document.getElementById('copy').onclick = copyFeedback;
}
window.onload = initiate;

function formatText() {
    console.log("starting");
    let strings = document.getElementById("textarea").value.split("\n");
    let node;
    let node2;
    let strong;
    let holder;
    let point;
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
        let blank = 0;
        if (strings[strings.length - 1]==""){
            blank = 1;
        }
        let name = strings[0].split(" ")[0];
        switch (strings.length-blank) {
            case 1:
                node = document.createElement("p");
                node.appendChild(document.createTextNode("Satisfactory."));
                node.appendChild(document.createElement("br"));
                node.appendChild(document.createTextNode(`Well done, ${name}.`));
                node.appendChild(document.createElement("br"));
                node.appendChild(document.createTextNode("Jake McAuliffe"));
                document.getElementById("result").appendChild(node);
                break;

            case 2:
                node = document.createElement("p");
                strong = document.createElement("strong");
                strong.appendChild(document.createTextNode("Resubmit needed."));
                node.appendChild(strong);
                node.appendChild(document.createElement("br"));
                node.appendChild(document.createTextNode(`Good job, ${name}. Only one question needs to be changed:`));
                document.getElementById("result").appendChild(node);

                holder = document.createElement("ul");
                holder.style.listStyleType = "none";
                holder.setAttribute('id',"middle");
                point = document.createElement("li");
                point.appendChild(document.createTextNode(strings[1]));
                holder.appendChild(point);
                document.getElementById("result").appendChild(holder);

                node2 = document.createElement("p");
                node2.appendChild(document.createTextNode("Please only change your answer to this question and leave all others blank."));
                node2.appendChild(document.createElement("br"));
                node2.appendChild(document.createTextNode("Jake McAuliffe"));
                document.getElementById("result").appendChild(node2);
                break;

            default:
                node = document.createElement("p");
                strong = document.createElement("strong");
                strong.appendChild(document.createTextNode("Resubmit needed."));
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
                node.appendChild(document.createTextNode(`Good job, ${name}, but ${qs} questions need to be changed:`));
                document.getElementById("result").appendChild(node);
                document.getElementById("result").appendChild(holder);

                node2 = document.createElement("p");
                node2.appendChild(document.createTextNode("Please only change your answer to these questions and leave all others blank."));
                node2.appendChild(document.createElement("br"));
                node2.appendChild(document.createTextNode("Jake McAuliffe"));
                document.getElementById("result").appendChild(node2);
                break;
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