var sketch = function (p) {
    var gradient,
        starfield,
        mist,
        mistColor,
        skyColor,
        buffer;

    p.preload = function() {
        skyColor = '#' + (url.searchParams.get('sky') || '000000');
        mistColor = '#' + (url.searchParams.get('mist') || 'ffffff');
    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        let skyWidth = Math.ceil(p.windowWidth / 3);
        let skyHeight = Math.ceil(p.windowHeight / 3);
        buffer = p.createGraphics(skyWidth, skyHeight);
        p.imageMode(p.CORNER);
        starfield = new Starfield(
            p,
            Math.sqrt(skyWidth * skyWidth + skyHeight * skyHeight),
            0.8, 0.05);
        mist = new Mist(p, skyWidth, skyHeight, 8, 1, mistColor);
        lightOrigin = p.createVector(0, 0);
        lightOrigin.x = p.random(buffer.width);
        lightOrigin.y = p.random(buffer.height);
    };

    p.draw = function () {
        buffer.background(skyColor);
        starfield.drawAt(buffer, 0, 0);
        mist.drawAt(buffer, 0, 0);

        p.push();
        p.noSmooth();
        p.scale(3);
        p.image(buffer, 0, 0);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}
