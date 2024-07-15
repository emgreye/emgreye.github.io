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

    if (Math.random() < 0.5){
        randIndex = Math.floor(Math.random() * arr.length);
    }

    return arr[randIndex];
}

x = 0
array = []
while(x<20) {
    array.append(pick([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]));
    x += 1;
}
print(array)