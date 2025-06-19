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

x = 0;
arrg = [];
numbers = [];
num = 0;
while (num<=60){
    numbers.push(num);
    num++;
}
while(x<48) {
    arrg.push(boringpick(numbers));
    x += 1;
}
console.log(arrg);