var sketch = function (p) {
    var scale,
        scroll = 0,
        mid = 0,
        gradient,
        stars,
        data = {},
        desk = null;

    p.preload = function() {
        desk = p.loadImage('assets/img/haunty_backdrop.png');
    }

    p.setup = function () {
        // P5 prep.
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.imageMode(p.CORNER);
        scale = setScale();
        gradient = makeGradient();
        stars = makeStars();
        stars.rotation = 0;
        data.palette = function() {
            scale = setScale();
            gradient = makeGradient();
        };
    };

    p.draw = function () {
        // Gradient background
        p.image(gradient, 0, 0, gradient.width, gradient.height, 0, -scroll, p.width, p.height * 4);
        p.image(gradient, 0, 0, gradient.width, gradient.height, 0, p.height * 4 - scroll, p.width, p.height * 4);

        // Increment and wrap background scroll.
        scroll += 2;
        if (scroll > gradient.height) { scroll = 0; }
        // Update and draw stars.
        p.push();
        p.rotate(stars.rotation);
        p.stroke(255);
        for (var i = 0; i < stars.length; i++) {
            var v = stars[i];
            p.strokeWeight(v.size + Math.random() - 0.5);
            p.point(v.x, v.y);
        }
        stars.rotation -= 0.00003;
        p.pop();
        p.image(desk, 0, 0);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        gradient = makeGradient();
        stars = makeStars();
        stars.rotation = 0;
    };

    // Returns gradient graphic.
    function makeGradient() {
        var graphic = p.createGraphics(p.width, p.height * 4),
            c = scale(0).rgb(),
            count = 0;
        for (var y = 0; y < graphic.height/4; y++) {
            graphic.stroke(c);
            graphic.line(0, y, graphic.width, y);
        }
        for (var y = graphic.height/4; y < graphic.height/2; y++) {
            c = scale( p.map(y, graphic.height/4, graphic.height/2, 0, 1) ).rgb() ;
            graphic.stroke(c);
            graphic.line(0, y, graphic.width, y);
        }
        c = scale(1).rgb();
        for (var y = graphic.height/2; y < graphic.height * (3/4); y++) {
            graphic.stroke(c);
            graphic.line(0, y, graphic.width, y);
        }
        for (var y = graphic.height * (3/4); y <= graphic.height; y++) {
            c = scale((y - graphic.height * (3/4))/(graphic.height/4)).rgb();
            graphic.stroke(c);
            graphic.line(0, graphic.height - count, graphic.width, graphic.height - count);
            count++;
        }
        return graphic;
    }

    // Returns array of points within a radius.
    function makeStars() {
        var result = [],
            radius = p.max(p.width, p.height) * 2;
        for (var i = 0; i < 10000; i++) {
            var v = p.createVector(p.random(-radius, radius), p.random(-radius, radius));
            v.size = p.random(1, 5);
            result.push(v);
        }
        return result;
    }

    // Returns a chroma scale.
    function setScale() {
        var l = [chroma(91, 8, 38), chroma(0,35,51)],
            bezInterpolator = null
            chance = p.random();
        if (chance > 0.5) {
            l.sort(function(a, b) {
              return b.get('hcl.l') - a.get('hcl.l');
            });
        } else {
            l.sort(function(a, b) {
                return a.get('hcl.l') - b.get('hcl.l');
            });
        }
        bezInterpolator = chroma.bezier([l[0], l[1]]);
        return chroma.scale(bezInterpolator).correctLightness(true).padding(0.15);
    }
}
