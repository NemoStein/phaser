function Out(v) {
    if (v < 1 / 2.75) {
        return 7.5625 * v * v;
    }
    else if (v < 2 / 2.75) {
        return 7.5625 * (v -= 1.5 / 2.75) * v + 0.75;
    }
    else if (v < 2.5 / 2.75) {
        return 7.5625 * (v -= 2.25 / 2.75) * v + 0.9375;
    }
    else {
        return 7.5625 * (v -= 2.625 / 2.75) * v + 0.984375;
    }
}

export { Out };
