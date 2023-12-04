import json
import random

def pick(list):
    biglist = []
    for value in list:
        divisor = max(len(value['pron']), 1)
        for times in range (12//divisor):
            biglist.append(value)
    return random.choice(biglist)

def make_syllable():
    with open("english_syllable.json", encoding='utf-8') as file:
        info = json.load(file)
    onset = pick(info['onset'])
    nucleus = coda = pick(info['nucleus'])
    if not nucleus['can_end']:
        coda = {'pron': "", "spell": ""}
        while coda['spell'] == "":
            coda = pick(info['coda'])
    else:
        coda = pick(info['coda'])
    if nucleus['pron'][0] == 'j':
        if len(onset['pron']) > 0:
            if onset['pron'][-1] == 't':
                nucleus['pron']= 'ʃ' + nucleus['pron'][1:]
            elif onset['pron'][-1] == 'd':
                nucleus['pron'] = 'ʒ' + nucleus['pron'][1:]
            elif onset['pron'][-1] in ['ɹ','l','w']:
                nucleus['pron'] = nucleus['pron'][1:]
    if len(coda['spell']) > 1:
        if (coda['spell'][0] == coda['spell'][1] or coda['spell'] == "ck") and len(nucleus['spell'])>1:
            coda['spell'] = coda['spell'][1:]

    if "_e" in nucleus['spell']:
        nucleus['spell'] = nucleus['spell'][:-2]
        if len(coda['spell']) == 1:
            coda['spell'] += 'e'
        else:
            nucleus['spell'] = nucleus['altspell']

    return {'pron': onset['pron']+nucleus['pron']+coda['pron'], 'spell': onset['spell']+nucleus['spell']+coda['spell']}

def make_word():
    with open("english_syllable.json", encoding='utf-8') as file:
        info = json.load(file)
    vowelend = ['ː']
    for value in info['nucleus']:
        vowelend.append(value['pron'][0])
    syllables = int(8 * pow(300, -random.uniform(0,1)-0.2) + 1)
    word = make_syllable()
    for sylno in range(1, syllables):
        syl = make_syllable()
        if word['pron'][-1] in vowelend and syl['pron'][0] in vowelend:
            word['pron'] = word['pron'] + 'ɹ' + syl['pron']
        else:
            word['pron'] = word['pron'] + syl['pron']
        word['spell'] = word['spell'] + syl['spell']
    return word

words = []
for index in range(250):
    words.append(make_word())
json_string = json.dumps(words, indent=4, ensure_ascii=False)
with open("english-ish.json", "a", encoding='utf-8') as f:
    f.truncate(0)
    f.write(json_string)
with open("english-ish.txt", "a", encoding='utf-8') as f:
    f.truncate(0)
    f.write(json_string)