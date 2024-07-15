function pick(arr) {
    function randn_bm() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Convert [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    randIndex = -1;

    while (randIndex < 0) {
        randIndex = Math.floor(randn_bm() * (arr.length / 6));
    }
    if (randIndex >= arr.length) randIndex = arr.length - 1;

    if (Math.random() < 0.3){
        randIndex = Math.floor(Math.random() * arr.length);
    }

    return arr[randIndex];
}

function makeSyllable(info) {
    let onset = pick(info['onset']);
    let nucleus = pick(info['nucleus']);
    let coda = "";
    if (onset['spell'].slice(-1) === "u"){
        while (nucleus['spell'].at(0) === "u"){
            nucleus = pick(info['nucleus']);
        }
    }

    if (!nucleus['can_end']) {
        coda = { 'pron': "", 'spell': "" };
        while (coda['spell'] === "") {
            coda = pick(info['coda']);
        }
    } else {
        coda = pick(info['coda']);
    }

    if (coda['spell'] === "r" || nucleus['spell'].slice(-1) === 'r') {
        while (onset['spell'].slice(-1) === 'r') {
            onset = pick(info['onset']);
        }
    }
    else if (coda['spell'].at(0) === "l" && onset['spell'].length > 1) {
        while (onset['spell'].slice(-1) === 'l') {
            onset = pick(info['onset']);
        }
    }

    if (nucleus['pron'] === 'ɔ' && onset['pron'].at(-1) === 'w') {
        nucleus['spell'] = 'a';
    }
    else if (nucleus['pron'] === 'oː' && onset['pron'].at(-1) === 'w') {
        nucleus['spell'] = 'ar';
    }
    else if (nucleus['pron'] === 'aː' && onset['pron'].at(-1) === 'w') {
        nucleus['pron'] = 'oː';
    }
    else if (nucleus['pron'] === 'æ' && onset['pron'].at(-1) === 'w') {
        nucleus['pron'] = 'ɔ';
    }

    if (nucleus['pron'][0] === 'j') {
        if (onset['pron'].length > 0) {
            if (onset['pron'].slice(-1) === 't') {
                nucleus['pron'] = 'ʃ' + nucleus['pron'].slice(1);
            } else if (onset['pron'].slice(-1) === 'd') {
                nucleus['pron'] = 'ʒ' + nucleus['pron'].slice(1);
            } else if (['ɹ', 'l', 'w', 'ʃ', 'ʒ'].includes(onset['pron'].slice(-1))) {
                nucleus['pron'] = nucleus['pron'].slice(1);
            }
        }
    }

    if (coda['pron'] > 1 && coda['pron'].slice(0,1) === "lk" && nucleus['pron'] === 'a') {
        nucleus['pron'] = 'ɔ';
    }

    if (coda['spell'].at(0) === "n" || coda['spell'].at(0) === "m"){
        if (nucleus['pron'] === "eː") {
            nucleus['spell'] = "a";
        } else if (nucleus['pron'] === "æ"){
            nucleus['pron'] = "eː";
        }
    }

    if (coda['spell'].length > 1) {
        if ((coda['spell'][0] === coda['spell'][1] || coda['spell'] === "ck") && nucleus['spell'].length > 1 && nucleus['spell'] != "eː") {
            coda['spell'] = coda['spell'].slice(1);
        }
    }

    if (coda['pron'].at(0) === "l" && nucleus['pron'].slice(-1) === "j"){
        nucleus['pron'] += "ə";
        console.log(nucleus['pron']);
    }

    if (coda['pron'] === "l" && nucleus['pron'] === "oː"){
        nucleus['spell'] = 'a';
    }

    if (nucleus['pron'] === "æj"){
        if (coda['pron'] === "dʒ") {
            nucleus['spell'] = 'a';
            coda['spell'] = 'ge';
        } else if (coda['pron'] === "ndʒ") {
            nucleus['spell'] = 'a';
            coda['spell'] = 'nge';
        } else if (coda['pron'] === "ndʒd") {
            nucleus['spell'] = 'a';
        }
    }

    if (onset['spell'] === "y" && nucleus['spell'] === "y"){
        nucleus[spell] = "i";
    }

    if (nucleus['spell'] === "o_e" && coda['spell'] === ""){
        nucleus['spell'] = "o";
    }

    if (nucleus['spell'] === "a_e" && coda['spell'] === ""){
        nucleus['spell'] = "ay";
    }

    if (nucleus['spell'].includes("_e")) {
        nucleus['spell'] = nucleus['spell'].slice(0, -2);
        if (coda['spell'].length === 1) {
            coda['spell'] += 'e';
        } else if (!coda['spell'].includes("e")){
            nucleus['spell'] = nucleus['altspell'];
        }
    } else if (coda['spell'] === ""){
        nucleus['spell'] = nucleus['altspell'];
    }

    if (coda['pron'] === "v" && nucleus['pron'] === "a"){
        nucleus['spell'] = "o";
    }

    if (onset['pron'].at(-1) === "k" && ['o', 'u', 'a'].includes(nucleus['spell'].at(0))){
        onset['pron'][-1] = "c";

    }

    finality = false;
    if (coda['pron'].length > 1 && ['t', 'd', 's', 'z', 'h'].includes(coda['pron'].slice(-1))){
        finality = true;
    }

    return {
        'pron': onset['pron'] + nucleus['pron'] + coda['pron'],
        'spell': onset['spell'] + nucleus['spell'] + coda['spell'],
        'isfinal': finality
    };
}

function makeWord(info) {
    let vowelend = ['ː'];
    info['nucleus'].forEach(value => {
        vowelend.push(value['pron'][0]);
    });

    let syllables = Math.floor(8 * Math.pow(300, -Math.random() - 0.2) + 1);
    let word = makeSyllable(info);

    for (let sylno = 1; sylno < syllables; sylno++) {
        if (!word['isfinal']){
            let syl = makeSyllable(info);
            while (syl['pron'].at(0) === word['pron'].slice(-1) ||syl['spell'].at(0) === word['spell'].slice(-1) ||
            syl['pron'].at(0) === "d" && word['spell'].slice(-1) === "t" || syl['pron'].at(0) === "z" && word['spell'].slice(-1) === "s" ||
            syl['pron'].at(0) === "j"){
                syl = makeSyllable(info);
            }
            if (vowelend.includes(word['pron'].slice(-1)) && vowelend.includes(syl['pron'][0])) {
                word['pron'] += 'ɹ' + syl['pron'];
            } else {
                word['pron'] += syl['pron'];
            }
            word['spell'] += syl['spell'];
            word['isfinal'] = syl['isfinal'];
        }
    }
    delete word['isfinal'];
    console.log(word)
    return word;
}

function displayword() {
    const json = {
        onset: [
            { spell: "m", pron: "m" },
            { spell: "n", pron: "n" },
            { spell: "p", pron: "p" },
            { spell: "b", pron: "b" },
            { spell: "t", pron: "t" },
            { spell: "d", pron: "d" },
            { spell: "k", pron: "k" },
            { spell: "g", pron: "g" },
            { spell: "ch", pron: "tʃ" },
            { spell: "j", pron: "dʒ" },
            { spell: "f", pron: "f" },
            { spell: "v", pron: "v" },
            { spell: "th", pron: "θ" },
            { spell: "th", pron: "ð" },
            { spell: "sh", pron: "ʃ" },
            { spell: "zh", pron: "ʒ" },
            { spell: "h", pron: "h" },
            { spell: "r", pron: "ɹ" },
            { spell: "y", pron: "j" },
            { spell: "w", pron: "w" },
            { spell: "l", pron: "l" },
            { spell: "pl", pron: "pl" },
            { spell: "bl", pron: "bl" },
            { spell: "cl", pron: "kl" },
            { spell: "gl", pron: "gl" },
            { spell: "br", pron: "bɹ" },
            { spell: "tr", pron: "tʃɹ" },
            { spell: "dr", pron: "dʒɹ" },
            { spell: "cr", pron: "kɹ" },
            { spell: "gr", pron: "gɹ" },
            { spell: "tw", pron: "tw" },
            { spell: "dw", pron: "dw" },
            { spell: "gw", pron: "gw" },
            { spell: "qu", pron: "kw" },
            { spell: "fl", pron: "fl" },
            { spell: "sl", pron: "sl" },
            { spell: "fr", pron: "fɹ" },
            { spell: "shr", pron: "ʃɹ" },
            { spell: "sw", pron: "sw" },
            { spell: "thw", pron: "θw" },
            { spell: "sp", pron: "sp" },
            { spell: "sk", pron: "sk" },
            { spell: "st", pron: "st" },
            { spell: "sm", pron: "sm" },
            { spell: "sn", pron: "sn" },
            { spell: "sph", pron: "sf" },
            { spell: "spl", pron: "spl" },
            { spell: "spr", pron: "spɹ" },
            { spell: "str", pron: "ʃtʃɹ" },
            { spell: "scr", pron: "skɹ" },
            { spell: "squ", pron: "skw" },
            { spell: "", pron: "" }
        ],
        nucleus: [
            { spell: "oo", pron: "ʊ", can_end: false },
            { spell: "i", pron: "ɪ", can_end: false },
            { spell: "e", pron: "e", can_end: false },
            { spell: "a", pron: "æ", can_end: false },
            { spell: "u", pron: "a", can_end: false },
            { spell: "o", pron: "ɔ", can_end: false },
            { spell: "u_e", pron: "jʉw", altspell: "ew", can_end: true },
            { spell: "oo", pron: "ʉw", can_end: true },
            { spell: "ee", pron: "ɪj", can_end: true },
            { spell: "air", pron: "eː", can_end: true },
            { spell: "er", pron: "ɜː", can_end: true },
            { spell: "ar", pron: "aː", can_end: true },
            { spell: "oor", pron: "ʊː", can_end: true },
            { spell: "or", pron: "oː", altspell: "aw", can_end: true },
            { spell: "ou", pron: "æw", altspell: "ow", can_end: true },
            { spell: "o_e", pron: "əw", altspell: "oa", can_end: true },
            { spell: "a_e", pron: "æj", altspell: "ei", can_end: true },
            { spell: "i_e", pron: "ɑj", altspell: "y", can_end: true },
            { spell: "oi", pron: "oj", altspell:"oy", can_end: true }
        ],
        coda: [
            { spell: "", pron: "" },
            { spell: "m", pron: "m" },
            { spell: "n", pron: "n" },
            { spell: "p", pron: "p" },
            { spell: "b", pron: "b" },
            { spell: "t", pron: "t" },
            { spell: "d", pron: "d" },
            { spell: "ck", pron: "k" },
            { spell: "g", pron: "g" },
            { spell: "tch", pron: "tʃ" },
            { spell: "dge", pron: "dʒ" },
            { spell: "ff", pron: "f" },
            { spell: "ve", pron: "v" },
            { spell: "th", pron: "θ" },
            { spell: "the", pron: "ð" },
            { spell: "sh", pron: "ʃ" },
            { spell: "zhe", pron: "ʒ" },
            { spell: "ng", pron: "ŋ" },
            { spell: "ll", pron: "l" },
            { spell: "lp", pron: "lp" },
            { spell: "lb", pron: "lb" },
            { spell: "lt", pron: "lt" },
            { spell: "ld", pron: "ld" },
            { spell: "lch", pron: "ltʃ" },
            { spell: "lge", pron: "ldʒ" },
            { spell: "lk", pron: "lk" },
            { spell: "lf", pron: "lf" },
            { spell: "lve", pron: "lv" },
            { spell: "lth", pron: "lθ" },
            { spell: "lse", pron: "ls" },
            { spell: "lls", pron: "lz" },
            { spell: "lsh", pron: "lʃ" },
            { spell: "lm", pron: "lm" },
            { spell: "ln", pron: "ln" },
            { spell: "mp", pron: "mp" },
            { spell: "ms", pron: "mz" },
            { spell: "mth", pron: "mθ" },
            { spell: "nth", pron: "nθ" },
            { spell: "nce", pron: "ns" },
            { spell: "ns", pron: "nz" },
            { spell: "nt", pron: "nt" },
            { spell: "nd", pron: "nd" },
            { spell: "nch", pron: "ntʃ" },
            { spell: "nge", pron: "nʒ" },
            { spell: "nk", pron: "ŋk" },
            { spell: "ngth", pron: "ŋkθ" },
            { spell: "ft", pron: "ft" },
            { spell: "sp", pron: "sp" },
            { spell: "st", pron: "st" },
            { spell: "sk", pron: "sk" },
            { spell: "shed", pron: "ʃt" },
            { spell: "thed", pron: "θt" },
            { spell: "zzed", pron: "zd" },
            { spell: "thed", pron: "ðd" },
            { spell: "fth", pron: "fθ" },
            { spell: "fths", pron: "fθs" },
            { spell: "pt", pron: "pt" },
            { spell: "ct", pron: "kt" },
            { spell: "pts", pron: "pts" },
            { spell: "cts", pron: "kts" },
            { spell: "pth", pron: "pθ" },
            { spell: "ts", pron: "ts" },
            { spell: "dth", pron: "tθ" },
            { spell: "ds", pron: "dz" },
            { spell: "x", pron: "ks" },
            { spell: "lmed", pron: "lmd" },
            { spell: "lped", pron: "lpt" },
            { spell: "lps", pron: "lps" },
            { spell: "lts", pron: "lts" },
            { spell: "lst", pron: "lst" },
            { spell: "lked", pron: "lkt" },
            { spell: "lks", pron: "lks" },
            { spell: "mpt", pron: "mpt" },
            { spell: "mps", pron: "mps" },
            { spell: "nts", pron: "nts" },
            { spell: "nct", pron: "ŋkt" },
            { spell: "nx", pron: "ŋks" },
            { spell: "mt", pron: "mt" },
            { spell: "mmed", pron: "md" },
            { spell: "nged", pron: "ŋd" },
            { spell: "nged", pron: "ndʒd" },
            { spell: "xth", pron: "ksθ" },
            { spell: "xed", pron: "kst" },
            { spell: "xths", pron: "ksθs" },
            { spell: "xts", pron: "ksts" }
        ]
    };
    const badwords = [
        "nig",
        "chink",
        "coon",
        "koon",
        "gyp",
        "jip",
        "jyp",
        "gip",
        "igga",
        "iga",
        "igger",
        "neeg"
    ]
    const badiffull = [
        "wog",
        "abo",
        "abbo",
        "kike",
        "kyk",
        "lebo", 
        "lebbo"
    ]
    const word = makeWord(json)
    while (badiffull.includes(word['spell'])){
        word = makeWord(json);
    }
    for (const bit of badwords){
        if (word['spell'].includes(bit)){
            word = makeWord(json);
        }
    }
    const div = document.getElementById("wordgen")
    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
    const spel = document.createElement("h2");
    spel.innerHTML = word['spell'];
    div.insertBefore(spel, null);
    const pron = document.createElement("h3");
    pron.innerHTML = "/" + word['pron'] + "/";
    div.insertBefore(pron, null);
}

