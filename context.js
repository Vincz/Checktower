class Context {
    constructor(size = 100) {
        this.size = size;
        this.history = [];
    }

    get(index = 0) {
        return this.history[index];
    }

    add(data) {
        this.history.unshift(data);
        this.history = this.history.slice(0, this.size);
    }
}

module.exports = Context;