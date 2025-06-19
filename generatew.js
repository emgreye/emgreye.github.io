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

function boringpick(arr) {
    function randn_bm() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Convert [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt(-1.0 * Math.log(u)) * Math.cos(16.0 * Math.PI * v);
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

function makeSyllable(info, stress) {
    let onset = "";
    let nucleus = "";
    let coda = "";
    let finality = false;

    if (!stress && Math.random() < 0.2){
        onset = boringpick(info['onset']);
        nucleus = boringpick(info['nucleus']);
        coda = "";

        //no double <u>s
        if (onset['spell'].slice(-1) === "u"){
            while (nucleus['spell'].at(0) === "u"){
                nucleus = boringpick(info['nucleus']);
            }
        //no double <i>s
        } else if (onset['spell'].slice(-1) === "i"){
            while (nucleus['spell'].at(0) === "i"){
                nucleus = boringpick(info['nucleus']);
            }
        }

        //only certain vowels can end a word/syllable
        if (!nucleus['can_end']) {
            coda = { 'pron': "", 'spell': "" };
            while (coda['spell'] === "") {
                coda = boringpick(info['coda']);
            }
        } else {
            coda = boringpick(info['coda']);
        }

        // no words are spelled <_r_r_> (e.g scror would not be a word)
        if (nucleus['spell'].slice(-1) === 'r') {
            while (onset['spell'].slice(-1) === 'r') {
                onset = boringpick(info['onset']);
            }
        }
        // no words are spelled <_l_l_> (e.g clelk would not be a word)
        else if (coda['spell'].at(0) === "l" && onset['spell'].length > 1) {
            while (onset['spell'].slice(-1) === 'l') {
                onset = boringpick(info['onset']);
            }
        }
    }
    else {
        onset = pick(info['onset']);
        nucleus = pick(info['nucleus']);
        coda = "";

        //no double <u>s
        if (onset['spell'].slice(-1) === "u"){
            while (nucleus['spell'].at(0) === "u"){
                nucleus = pick(info['nucleus']);
            }
        //no double <i>s
        } else if (onset['spell'].slice(-1) === "i"){
            while (nucleus['spell'].at(0) === "i"){
                nucleus = pick(info['nucleus']);
            }
        }

        //only certain vowels can end a word/syllable
        if (!nucleus['can_end']) {
            coda = { 'pron': "", 'spell': "" };
            while (coda['spell'] === "") {
                coda = pick(info['coda']);
            }
        } else {
            coda = pick(info['coda']);
        }

        // no words are spelled <_r_r_> (e.g scror would not be a word)
        if (nucleus['spell'].slice(-1) === 'r') {
            while (onset['spell'].slice(-1) === 'r') {
                onset = pick(info['onset']);
            }
        }
        // no words are spelled <_l_l_> (e.g clelk would not be a word)
        else if (coda['spell'].at(0) === "l" && onset['spell'].length > 1) {
            while (onset['spell'].slice(-1) === 'l') {
                onset = pick(info['onset']);
            }
        }
    }

    //<wor> in English is pronounced /wɘː/ (with a couple of exceptions: worry, sword)
    if (nucleus['pron'] === 'oː' && onset['pron'].at(-1) === 'w') {
        nucleus['pron'] = 'ɘː';
    }
    // <war> is pronounced /woː/
    else if (nucleus['pron'] === 'ɐː' && onset['pron'].at(-1) === 'w') {
        nucleus['pron'] = 'oː';
    }
    // <wa_> is pronounced /wɔ/
    else if (nucleus['pron'] === 'æ' && onset['pron'].at(-1) === 'w' && Math.random() < 0.5) {
        nucleus['pron'] = 'ɔ';
    }

    //simulating yod-coalescence and yod-dropping
    if (nucleus['pron'][0] === 'j') {
        if (onset['pron'].length > 0) {
            if (onset['pron'].slice(-1) === 't') {
                nucleus['pron'] = nucleus['pron'].slice(1);
                onset['pron'] += 'ʃ';
            } else if (onset['pron'].slice(-1) === 'd') {
                nucleus['pron'] = nucleus['pron'].slice(1);
                onset['pron'] += 'ʒ';
            } else if (onset['pron'].slice(-1) === 's') {
                nucleus['pron'] = nucleus['pron'].slice(1);
                onset['pron'] = 'ʃ';
            } else if (onset['pron'].slice(-1) === 'z') {
                nucleus['pron'] = nucleus['pron'].slice(1);
                onset['pron'] = 'ʒ';
            } else if (['ɹ', 'l', 'w', 'ʃ', 'ʒ'].includes(onset['pron'].slice(-1))) {
                nucleus['pron'] = nucleus['pron'].slice(1);
                if (onset['pron'].slice(-1) == 'ʒ'){
                    onset['spell'] = 's';
                }
            }
        }
    }

    //if <ul> is followed by a consonant, it is pronounced /ɔl/
    if (coda['pron'] > 1 && (coda['pron'].slice(0,1) === "lk" || coda['pron'].slice(0,1) === "lc" || coda['pron'].slice(0,1) === "lp") && nucleus['pron'] === 'ɐ') {
        nucleus['pron'] = 'ɔ';
    }

    // /æ/ becomes /eː/ or /e/ before nasal consonants
    if (coda['spell'].at(0) === "n" || coda['spell'].at(0) === "m"){
        if (nucleus['pron'] === "æ"){
            nucleus['pron'] = "eː";
        }
        if (nucleus['pron'] === "eː") {
            nucleus['spell'] = "a";
            if (coda['pron'].at(0) === "ŋ"){
                nucleus['pron'] = "e";
            }
        }
    // change the spelling depending on vowel length
    } else if (nucleus['pron'].length > 1){
        if (coda['spell'] === "zz"){
            coda['spell'] = "s"
        }
        else if (coda['spell'] === "x"){
            coda['spell'] = "cks";
        }
        else if (coda['spell'] === "nx"){
            coda['spell'] = "nks";
        }
        else if (coda['spell'].length > 1) {
            if ((coda['spell'][0] === coda['spell'][1] || coda['spell'].substr(0, 2) === "ck") && nucleus['spell'] != "eː") {
                coda['spell'] = coda['spell'].slice(1);
            }
        }
    } else {
        if (coda['spell'] === "ge"){
            coda['spell'] = "g";
            coda['pron'] = 'g';
        }
    }

    // add /ə/ in between /j/ and /l/
    if (coda['pron'].at(0) === "l" && nucleus['pron'].slice(-1) === "j"){
        nucleus['pron'] += "ə";
    }
    // /oːl/ is typically spelled <all>
    if (coda['pron'] === "l" && nucleus['pron'] === "oː"){
        nucleus['spell'] = 'a';
        coda['spell'] = 'll';
    }

    // /æjdʒ/ is spelled <age> and so on
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

    // 50% chance of spelling ite as ight
    if (nucleus['pron'] === "ɑj" && (coda['spell'].at(0) === "t" || coda['spell'] === "") && Math.random > 0.5){
        nucleus['spell'] = "igh";
    }

    // changes to alternate spelling if it's final
    if (coda['spell'] === "" && typeof(nucleus['finspell']) !== "undefined"){
        if (Math.random > 0.5){
            nucleus['spell'] = nucleus['finspell'];
            finality = true;
        }
    // /ɐv/ is usually spelled /ove/
    } else if (coda['pron'] === "v" && nucleus['pron'] === "ɐ"){
        nucleus['spell'] = "o";
    }

    // deals with <[vowel]_e> words
    if (nucleus['spell'].includes("_e")) {
        nucleus['spell'] = nucleus['spell'].slice(0, -2);
        if(coda['spell'] === "ck"){
            coda['spell'] = "k";
        } if (coda['spell'].length === 1) {
            coda['spell'] += 'e';
        } else if (coda['spell'].includes("e")){
            nucleus['spell'] = nucleus['altspell'];
        }
    }

    // prevents double <y>s
    if (onset['spell'] === "y" && nucleus['spell'] === "y"){
        nucleus['spell'] = "i";
    }

    // /k/ can be spelled as <c> when it's before <a>, <o>, or <u>
    if (onset['spell'].at(-1) === "k" && ['o', 'u', 'a'].includes(nucleus['spell'].at(0))){
        onset['spell'] = onset['spell'].slice(0, -1) + "c";
    }

    // /ʊd/ is more often spelled as <ould>
    if (nucleus['pron'] === "ʊ" && coda['pron'] === "d"){
        nucleus['spell'] = "ou";
        coda['spell'] = "ld";
    // historical /æ/ becomes /ɐː/ before certain consonant clusters
    } else if (nucleus['pron'] === "æ" && (coda['spell'].slice(0,2) === "ft" || coda['spell'].slice(0,2) === "sk" || coda['spell'].slice(0,2) === "lm" ||
        coda['spell'].slice(0,2) === "st")){
        nucleus['pron'] = "ɐː";
    }

    // short vowels can become /ə/ in unstressed syllables
    if (!stress && Math.random() < 0.5 && nucleus['pron'].length === 1){
        nucleus['pron'] = "ə"; 
    }

    // certain consonant clusters only appear in final syllables
    if (coda['pron'].length > 1 && ['t', 'd', 's', 'z', 'h'].includes(coda['spell'].at(-1))){
        finality = true;
    }

    // si as /ʒ/ should be zh before i
    if (onset['spell']==='si' && nucleus['spell'][0]==='i'){
        onset['spell'] = 'zh';
    }

    // don't mix up ise and ice
    if (coda['spell'] === 'se' && coda['pron' === 's']){
        coda['spell'] = 'ce';
    }

    // no double letters in uninportant syllables
    if (coda['spell'].length > 1 && coda['spell'][0] === coda['spell'][1]){
        coda['spell'] = coda['spell'].slice(1);
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

    let syllables = Math.floor(12 * Math.pow(300, -Math.random() - 0.2) + 1);
    let word = makeSyllable(info, true);

    if (word['pron'].at(0) === 'ʒ' && word['spell'].at(0) === 's'){
        syl = makeSyllable(info, true);
        while (vowelend.includes(syl['pron'].at(-1))){
            syl = makeSyllable(info, true);
        }
        coda = { 'pron': "", 'spell': "" };
        while (coda['spell'] === "") {
            coda = pick(info['coda']);
        }
        nucleus = { 'pron': "www", 'spell': "www" };
        while (nucleus['spell'].length > 1 && nucleus['spell'] != "i"){
            nucleus = pick(info['nucleus']);
        }
        word['pron'] = syl['pron'] + "ʒə" + coda['pron'];
        word['spell'] = syl['spell'] + "si" + nucleus['spell'] + coda['spell'];
    }
    for (let sylno = 1; sylno < syllables; sylno++) {
        let syl = makeSyllable(info, false);
        if (Math.random() < 0.5){
            if (!word['isfinal']){
                if (sylno === 1){
                    word['pron'] = "ˈ" + word['pron'];
                }
                while (syl['pron'].at(0) === word['pron'].slice(-1) ||syl['spell'].at(0) === word['spell'].slice(-1) ||
                syl['pron'].at(0) === "d" && word['spell'].slice(-1) === "t" || syl['pron'].at(0) === "z" && word['spell'].slice(-1) === "s" ||
                syl['pron'].at(0) === "j" || (word['spell'].slice(-1) === "e" && ['a', 'e', 'i', 'o', 'u'].includes(syl['spell'].at(0)))){
                    syl = makeSyllable(info, false);
                }
                if (syl['pron'].at(0) == 'ʒ' && !(['a', 'e', 'i', 'o', 'u', 'y', 'r'].includes(word['spell'].at(-1)))){
                    syl['pron'][0] = 'ʃ';
                }
                if (vowelend.includes(word['pron'].slice(-1)) && vowelend.includes(syl['pron'][0])) {
                    word['pron'] += 'ɹ' + syl['pron'];
                } else {
                    word['pron'] += syl['pron'];
                }
                word['spell'] += syl['spell'];
                word['isfinal'] = syl['isfinal'];
            }
        } else {
            if (sylno === 1){
                word['pron'] = "ˈ" + word['pron'];
            }
            while (word['pron'].at(0) === syl['pron'].slice(-1) ||word['spell'].at(0) === syl['spell'].slice(-1) ||
            word['pron'].at(0) === "d" && syl['spell'].slice(-1) === "t" || word['pron'].at(0) === "z" && syl['spell'].slice(-1) === "s" ||
            syl['isfinal'] === true || word['pron'].at(0) === "j" || (syl['spell'].slice(-1) === "e" &&
            ['a', 'e', 'i', 'o', 'u'].includes(word['spell'].at(0)))){
                syl = makeSyllable(info, false);
            }
            if (word['pron'].at(0) == 'ʒ' && !(['a', 'e', 'i', 'o', 'u', 'y', 'r'].includes(syl['spell'].at(-1)))){
                word['pron'][0] = 'ʃ';
            }
            if (vowelend.includes(syl['pron'].slice(-1)) && vowelend.includes(word['pron'][0])) {
                word['pron'] = syl['pron'] + 'ɹ' + word['pron'];
            } else {
                word['pron'] = syl['pron'] + word['pron'];
            }
            word['spell'] = syl['spell'] + word['spell'];
        }
    }
    delete word['isfinal'];
    console.log(word)
    return word;
}

function displayword() {
    const json = {
        onset: [
            { spell: "", pron: "" },
            { spell: "t", pron: "t" },
            { spell: "d", pron: "d" },
            { spell: "k", pron: "k" },
            { spell: "g", pron: "g" },
            { spell: "m", pron: "m" },
            { spell: "n", pron: "n" },
            { spell: "s", pron: "s" },
            { spell: "z", pron: "z" },
            { spell: "p", pron: "p" },
            { spell: "b", pron: "b" },
            { spell: "ch", pron: "tʃ" },
            { spell: "j", pron: "dʒ" },
            { spell: "f", pron: "f" },
            { spell: "v", pron: "v" },
            { spell: "sh", pron: "ʃ" },
            { spell: "h", pron: "h" },
            { spell: "r", pron: "ɹ" },
            { spell: "y", pron: "j" },
            { spell: "w", pron: "w" },
            { spell: "l", pron: "l" },
            { spell: "sp", pron: "sb" },
            { spell: "sk", pron: "sg" },
            { spell: "st", pron: "sd" },
            { spell: "str", pron: "ʃdʒɹ" },
            { spell: "scr", pron: "sgɹ" },
            { spell: "sm", pron: "sm" },
            { spell: "sn", pron: "sn" },
            { spell: "tr", pron: "tʃɹ" },
            { spell: "dr", pron: "dʒɹ" },
            { spell: "cr", pron: "kɹ" },
            { spell: "si", pron: "ʒ", altspell: "zh" },
            { spell: "gr", pron: "gɹ" },
            { spell: "fr", pron: "fɹ" },
            { spell: "shr", pron: "ʃɹ" },
            { spell: "pl", pron: "pl" },
            { spell: "bl", pron: "bl" },
            { spell: "cl", pron: "kl" },
            { spell: "gl", pron: "gl" },
            { spell: "br", pron: "bɹ" },
            { spell: "th", pron: "θ" },
            { spell: "th", pron: "ð" },
            { spell: "tw", pron: "tw" },
            { spell: "dw", pron: "dw" },
            { spell: "gw", pron: "gw" },
            { spell: "qu", pron: "kw" },
            { spell: "fl", pron: "fl" },
            { spell: "sl", pron: "sl" },
            { spell: "sw", pron: "sw" },
            { spell: "thw", pron: "θw" },
            { spell: "sph", pron: "sf" },
            { spell: "spl", pron: "sbl" },
            { spell: "spr", pron: "sbɹ" },
            { spell: "squ", pron: "sgw" }
        ],
        nucleus: [
            { spell: "i", pron: "ɪ", can_end: false },
            { spell: "e", pron: "e", can_end: false },
            { spell: "a", pron: "æ", can_end: false },
            { spell: "u", pron: "ɐ", can_end: false },
            { spell: "o", pron: "ɔ", can_end: false },
            { spell: "oo", pron: "ʉw", can_end: true },
            { spell: "ea", pron: "ɪj", finspell: "ee", can_end: true },
            { spell: "or", pron: "oː", finspell: "aw", can_end: true },
            { spell: "ar", pron: "ɐː", can_end: true },
            { spell: "o_e", pron: "ʌw", altspell: "oa", finspell: "o", can_end: true },
            { spell: "a_e", pron: "æj", altspell: "ei", finspell: "ay", can_end: true },
            { spell: "i_e", pron: "ɑj", altspell: "y", finspell: "ai", can_end: true },
            { spell: "oo", pron: "ʊ", can_end: false },
            { spell: "air", pron: "eː", can_end: true },
            { spell: "er", pron: "ɘː", can_end: true },
            { spell: "u_e", pron: "jʉw", altspell: "ew", can_end: true },
            { spell: "ou", pron: "æw", finspell: "ow", can_end: true },
            { spell: "oi", pron: "oj", finspell:"oy", can_end: true },
            { spell: "oor", pron: "ʊː", can_end: true }
        ],
        coda: [
            { spell: "", pron: "" },
            { spell: "m", pron: "m" },
            { spell: "n", pron: "n" },
            { spell: "t", pron: "t" },
            { spell: "d", pron: "d" },
            { spell: "ck", pron: "k" },
            { spell: "g", pron: "g" },
            { spell: "ss", pron: "s" },
            { spell: "zz", pron: "z" },
            { spell: "tch", pron: "tʃ" },
            { spell: "dge", pron: "dʒ" },
            { spell: "p", pron: "p" },
            { spell: "b", pron: "b" },
            { spell: "ff", pron: "f" },
            { spell: "ve", pron: "v" },
            { spell: "ft", pron: "ft" },
            { spell: "sp", pron: "sp" },
            { spell: "st", pron: "st" },
            { spell: "sk", pron: "sk" },
            { spell: "th", pron: "θ" },
            { spell: "the", pron: "ð" },
            { spell: "sh", pron: "ʃ" },
            { spell: "ge", pron: "ʒ" },
            { spell: "ng", pron: "ŋ" },
            { spell: "ll", pron: "l" },
            { spell: "nth", pron: "nθ" },
            { spell: "nce", pron: "ns" },
            { spell: "ns", pron: "nz" },
            { spell: "nt", pron: "nt" },
            { spell: "nd", pron: "nd" },
            { spell: "nch", pron: "ntʃ" },
            { spell: "nk", pron: "ŋk" },
            { spell: "x", pron: "ks" },
            { spell: "mp", pron: "mp" },
            { spell: "ms", pron: "mz" },
            { spell: "mth", pron: "mθ" },
            { spell: "ngth", pron: "ŋkθ" },
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
            { spell: "gs", pron: "gz" },
            { spell: "ps", pron: "ps" },
            { spell: "bs", pron: "bz" },
            { spell: "ffs", pron: "fs" },
            { spell: "ves", pron: "vz" },
            { spell: "fts", pron: "fts" },
            { spell: "sps", pron: "sps" },
            { spell: "sts", pron: "sts" },
            { spell: "sks", pron: "sks" },
            { spell: "ths", pron: "θs" },
            { spell: "thes", pron: "ðz" },
            { spell: "ngs", pron: "ŋz" },
            { spell: "lls", pron: "lz" },
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
            { spell: "lp", pron: "lp" },
            { spell: "lb", pron: "lb" },
            { spell: "lt", pron: "lt" },
            { spell: "ld", pron: "ld" },
            { spell: "lch", pron: "ltʃ" },
            { spell: "lge", pron: "ldʒ" },
            { spell: "lk", pron: "lk" },
            { spell: "lf", pron: "lf" },
            { spell: "lve", pron: "lv" },
            { spell: "lves", pron: "lvz" },
            { spell: "nge", pron: "nʒ" },
            { spell: "lth", pron: "lθ" },
            { spell: "lse", pron: "ls" },
            { spell: "lsh", pron: "lʃ" },
            { spell: "lm", pron: "lm" },
            { spell: "ln", pron: "ln" },
            { spell: "lms", pron: "lmz" },
            { spell: "lns", pron: "lnz" },
            { spell: "xth", pron: "ksθ" },
            { spell: "xed", pron: "kst" },
            { spell: "sks", pron: "sks" },
            { spell: "xths", pron: "ksθs" },
            { spell: "xts", pron: "ksts" }
        ]
    };
    const badwords = [
        "nig",
        "chink",
        "koon",
        "gyp",
        "jip",
        "jyp",
        "gip",
        "igga",
        "iga",
        "igger",
        "neeg",
        "gook",
        "fag"
    ]
    const badiffull = [
        "wog",
        "abo",
        "abbo",
        "coon",
        "kike",
        "kyk",
        "lebo", 
        "lebbo",
        "trannee",
        "tranee",
        "mong"
    ]
    let word = makeWord(json);
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

