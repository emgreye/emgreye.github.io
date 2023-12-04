import json
import random
import math
from unidecode import unidecode
import re

def consonant_inv():
    inv = []
    maninv = []
    with open("consonantrarity.json", encoding='utf-8') as file:
        cr = json.load(file)
    dist = {}
    manner = {}
    dist['voice'] = cr[0]['voice'] > random.uniform(0, 1)
    dist['ejective'] = cr[0]['ejective'] > random.uniform(0, 1)
    dist['labialised'] = cr[0]['labialised'] > random.uniform(0, 1)
    dist['palatalised'] = cr[0]['palatalised'] > random.uniform(0, 1)
    dist['velarised'] = cr[0]['velarised'] > random.uniform(0, 1)
    dist['aspiration'] = cr[0]['aspiration'] > random.uniform(0, 1)
    dist['voiceless'] = cr[0]['voiceless'] > random.uniform(0, 1)
    dist['geminated'] = cr[0]['geminated'] > random.uniform(0, 1)
    manner['plosive'] = cr[0]['plosive'] > random.uniform(0, 1)
    manner['nasal'] = cr[0]['nasal'] > random.uniform(0, 1)
    manner['fricative'] = cr[0]['fricative'] > random.uniform(0, 1)
    manner['lfricative'] = cr[0]['lfricative'] > random.uniform(0, 1)
    manner['affricate'] = cr[0]['affricate'] > random.uniform(0, 1)
    manner['laffricate'] = cr[0]['laffricate'] > random.uniform(0, 1)
    manner['tap'] = cr[0]['tap'] > random.uniform(0, 1)
    manner['ltap'] = cr[0]['ltap'] > random.uniform(0, 1)
    manner['approximant'] = cr[0]['approximant'] > random.uniform(0, 1)
    manner['uncommon_approximant'] = cr[0]['uncommon_approximant'] > random.uniform(0, 1)
    manner['trill'] = cr[0]['trill'] > random.uniform(0, 1)
    manner['click'] = cr[0]['click'] > random.uniform(0, 1)
    manner['implosive'] = cr[0]['implosive'] > random.uniform(0, 1)

    voiceness = 0
    if dist['voice']:
        voiceness = random.randint(1,2)
    for i in range(0,5):
        if (cr[1][str(i) + "chance"] > random.uniform(0, 1)):
            inv.append(cr[1][str(i)])
            maninv.append(cr[1][str(i) + "manner"])
    for i in range(2, len(cr)):
        if (cr[i]['chance'] > random.uniform(0, 1)):
            prefix = [""]
            if voiceness == 0:
                prefix.append("uv_")
                prefix.append("v_")
            elif voiceness == 1:
                prefix.append("v_")
            else:
                prefix.append("uv_")
            for m in manner:
                if manner[m]:
                    for p in prefix:
                            if p + m in cr[i] and cr[i][p + m] not in inv:
                                if (cr[i]['chance'] ** (1/3)  > random.uniform(0, 1)):
                                    sounds = [cr[i][p + m]]
                                    mansounds = [m]
                                    if m in ["plosive","affricate","fricative","lfricative"]:
                                        if dist['labialised']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    sounds.append(sounds[j]+"ʷ")
                                                    mansounds.append(m)
                                        if dist['palatalised']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    if sounds[j][-1] not in ["ʷ"] and cr[i]['name'] != "palatal":
                                                        sounds.append(sounds[j]+"ʲ")
                                                        mansounds.append(m)
                                        if dist['velarised']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    if sounds[j][-1] not in ["ʷ","ʲ"] and cr[i]['name'] != "velar":
                                                        sounds.append(sounds[j]+"ˠ")
                                                        mansounds.append(m)
                                        if dist['aspiration']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    if sounds[j][-1] not in ["ʷ","ʲ","ˠ"] and cr[i]['name'] != "glottal":
                                                        if p == "uv_":
                                                            sounds.append(sounds[j]+"ʰ")
                                                            mansounds.append(m)
                                                        else:
                                                            sounds.append(sounds[j]+"ʱ")
                                                            mansounds.append(m)
                                        if dist['ejective']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    if p == "uv_":
                                                        sounds.append(sounds[j]+"'")
                                                        mansounds.append(m)
                                        
                                    else:
                                        if dist['voiceless']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    sounds.append(sounds[j]+u'\u0325')
                                                    mansounds.append(m)
                                        if dist['geminated']:
                                            if (cr[i]['chance'] ** (1/2)  > random.uniform(0, 1)):
                                                for j in range(len(sounds)):
                                                    sounds.append(sounds[j]+"ː")
                                                    mansounds.append(m)
                                    inv += sounds
                                    maninv += mansounds
    assert(len(maninv) == len(inv))
    return [inv,dist,manner, maninv]

def vowel_inv():
    number = int(random.betavariate(3,11) *25)+1
    if number == 1:
        inv = ['a']
        if random.randint(0,1):
            inv.append('aː')
    elif number == 2:
        inv = random.choice([['i','a'],['i','u'],['a','u']])
        if random.randint(0,1):
            for i in range(len(inv)):
                inv.append(inv[i] + 'ː')
    elif number == 3:
        inv = ['i','a','u']
        if random.randint(0,1):
            for i in range(len(inv)):
                inv.append(inv[i] + 'ː')
    elif number == 4:
        inv = random.choice([['i','a','u','ə'],['i','a','u','e'],['i','a','u','o']])
        if random.randint(0,1):
            for i in range(len(inv)):
                inv.append(inv[i] + 'ː')
    elif number == 5:
        inv = ['i','a','u','o','e']
        if random.randint(0,1):
            for i in range(len(inv)):
                inv.append(inv[i] + 'ː')
    else:
        inv = [0]*number
        vowel_rare = ['a', 'i', 'u', 'e', 'o', 'ə', 'ɛ', 'ɔ', 'ɐ', 'ɒ', 'ɪ', 'ʊ', 'æ', 'y', 'ɯ', 'ɑ', 'ɨ', 'ʉ', 'ø', 'ɤ', 'œ', 'ʌ', 'ʏ', 'ɘ', 'ɜ', 'ɶ', 'ɵ', 'ɞ']
        end_rare = ['', 'ː', 'j', 'w']
        for i in range(number):
            while inv[i] == 0:
                vowel = vowel_rare[int(len(vowel_rare) * ((pow(30, -random.uniform(0,1))-0.05)))]+end_rare[int(len(end_rare) * ((pow(30, -random.uniform(0,1))-0.05)))]
                if vowel not in inv:
                    inv[i] = vowel
    return inv

def inv():
    inv = vowel_inv() + consonant_inv()[0]
    return inv

def generate_spelling():
    inv = inv()
    spelling = []
    return (inv, spelling)

def syllable_structure(dist, manner):
    max_onset = []
    part = ['plosive']
    if (manner['click'] and random.uniform(0,1) < 0.5):
        part.append('click')
    if (manner['implosive'] and random.uniform(0,1) < 0.3):
        part.append('implosive')
    if (manner['fricative']):
        if(random.uniform(0,1) < 0.2):
            max_onset.append(part)
            part = ['fricative']
        else:
            part.append('fricative')
    if (manner['lfricative'] and random.uniform(0,1) < 0.9):
        part.append('lfricative')
    if (manner['affricate'] and random.uniform(0,1) < 0.9):
        part.append('affricate')
    if (manner['laffricate'] and random.uniform(0,1) < 0.9):
        part.append('laffricate')
    if (random.uniform(0,1) < 0.2):
        max_onset.append(part)
        part = []
    if (manner['nasal'] and random.uniform(0,1) < 0.8):
        part.append('nasal')
    if (random.uniform(0,1) < 0.9):
        max_onset.append(part)
        part = []
    if (manner['trill'] and random.uniform(0,1) < 0.9):
        part.append('trill')
    if (manner['tap'] and random.uniform(0,1) < 0.9):
        part.append('tap')
    if (manner['ltap'] and random.uniform(0,1) < 0.9):
        part.append('ltap')
    if (random.uniform(0,1) < 0.2):
        max_onset.append(part)
        part = []
    if (manner['approximant'] and random.uniform(0,1) < 0.7):
        part.append('approximant')
    if (manner['uncommon_approximant'] and random.uniform(0,1) < 0.4):
        part.append('uncommon_approximant')
    if (part != []):
        max_onset.append(part)

    if (random.uniform(0,1) < 0.1):
        nucleus = random.choice([['vowel','liquid'],['vowel', 'fricative'],['vowel', 'nasal']])
    else:
        nucleus = ['vowel']

    max_coda = []
    for part in max_onset:
        if (random.uniform(0,1) > 1.0/len(max_onset)):
            max_coda.insert(0, part)
        else:
            break
    if max_coda == []:
        if (random.uniform(0,1) < 0.5):
            max_coda = [['nasal']]

    min = random.randint(1,2)

    structure = {
        "onset": max_onset,
        "nucleus": nucleus,
        "coda": max_coda,
        "min": min,
        "max": random.randint(min,5)
    }
    return structure

def generate_word_from_file(filename):
    return 0

def generate_syllable(vowel, consonant, syllable):
    onset = ""
    if (random.uniform(0,1) < 0.5):
        onset = random.choice(consonant[0])    
    else:
        for part in syllable['onset']:
            if (random.uniform(0,1) < 0.5):
                potential = []
                for manner in part:
                    for index in range(len(consonant[0])):
                        if manner == consonant[3][index]:
                            potential.append(consonant[0][index])
                if potential != []:
                    onset += random.choice(potential)
    
    vowels = []
    for v in vowel:
        vowels.append(v)
    if 'liquid' in syllable['nucleus']:
        if 'l' in consonant[0]:
            vowels.append('l')
        if 'r' in consonant[0]:
            vowels.append('r')
    if 'nasal' in syllable['nucleus']:
        for index in range(len(consonant[0])):
            if consonant[3][index] == 'nasal':
                vowels.append(consonant[0][index])
    if 'fricative' in syllable['nucleus']:
        for index in range(len(consonant[0])):
            if consonant[3][index] == 'fricative':
                vowels.append(consonant[0][index])
    nucleus = random.choice(vowels)

    coda = ""
    if (random.uniform(0,1) < 0.5):
        coda = random.choice(consonant[0])    
    else:
        for part in syllable['onset']:
            if (random.uniform(0,1) < 0.5):
                potential = []
                for manner in part:
                    for index in range(len(consonant[0])):
                        if manner == consonant[3][index]:
                            potential.append(consonant[0][index])
                if potential != []:
                    coda += random.choice(potential)

    return onset + nucleus + coda

def generate_word(vowel, consonant, syllable):
    sylcount = int(syllable['max']* ((pow(300, -random.uniform(0,1)-0.1)))+syllable['min']+0.7)
    word = ""
    for syl in range(sylcount):
        word += generate_syllable(vowel, consonant, syllable)

    return word

def spell(string):
    spelt = ""
    with open("spelling.json", encoding='utf-8') as file:
        sp = json.load(file)
    for char in string:
        if char == "ː":
            spelt += spelt[-1]
        else:
            value = ""
            for pair in sp:
                if char == pair['ipa']:
                    value = pair['spelling']
                    break
            if value == "":
                spelt += char
            else:
                spelt += value
    return spelt
            
def generate_language():
    consonant = consonant_inv()
    vowel = vowel_inv()
    syllable = syllable_structure(consonant[1],consonant[2])
    name = generate_word(vowel, consonant, syllable)
    vocab = []
    for index in range(50):
        word = generate_word(vowel, consonant, syllable)
        dict = {
            "pronunciation": word,
            "spelling": spell(word)
        }
        vocab.append(dict)
    lang = {
        "name": name,
        "syllables": syllable,
        "consonants": consonant[0],
        "consonant_manners": consonant[3],
        "vowels": vowel,
        "distribution": consonant[1],
        "manners": consonant[2],
        "vocabulary": vocab
        }
    simplenamelist = re.findall("[a-z]",unidecode(spell(name)))
    simplename = ""
    for char in simplenamelist:
        simplename += char
    if simplename == "":
        simplename = random.randint(0,9999)
    json_string = json.dumps(lang, indent=4, ensure_ascii=False)
    with open("languages/" + simplename + ".json", "a", encoding='utf-8') as f:
        f.write(json_string)


generate_language()