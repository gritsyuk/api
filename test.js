class ApiFeatures {
    constructor (query, string) {
        this.query = query;
        this.string = string;
    }
    find() {
        this.query = this.query(this.string);
        return this;
    }
}

function albert(x) {
    return `this is ${x}`;
}

let k = albert;

let test = new ApiFeatures(k, '345');

console.log(test.find().query);