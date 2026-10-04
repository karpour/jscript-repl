function benchmark(fn, iterations) {
    var start = Date.parse(new Date());

    for (var i = 0; i < iterations; i++) {
        fn();
    }

    var end = Date.parse(new Date());
    return end - start;
}