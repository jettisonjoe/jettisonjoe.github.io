/* global p5 */

var sketch = function (p) {
    const NOISE_SCALE = 0.001;
    const MAX_PARTICLE_COUNT = 2000;
    const PARTICLE_SIZE = 16;
    const PARTICLE_SPEED = 2;
    const MARGIN = 0;

    var winW, winH,
        particles = [],
        ages = [],
        polarities = [],
        emitter;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        var seed = (Math.random() * 4294967296)  >>> 0;
        p.noiseSeed(seed);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        winW = p.windowWidth;
        winH = p.windowHeight;
        emitter = p.createVector(MARGIN + Math.random() * (winW - 2 * MARGIN),
                                 MARGIN + Math.random() * (winH - 2 * MARGIN));
    };

    p.draw = function () {
        if (particles.length < MAX_PARTICLE_COUNT) {
            particles.push(emitter.copy());
            ages.push(1000);
        }
        p.noStroke();
        p.fill((p.frameCount/10) % 360, 100, 100, 1);
        for (var i = 0; i < particles.length; i++) {
            var loc = particles[i];
            var vel = curl(loc.x,
                           loc.y,
                           p.frameCount,
                           rampedPerlinPotential,
                           p).setMag(PARTICLE_SPEED);
            loc.add(vel);
            // contain(loc, i);
            p.rect(loc.x - PARTICLE_SIZE / 2,
                   loc.y - PARTICLE_SIZE / 2,
                   PARTICLE_SIZE,
                   PARTICLE_SIZE);
            if (ages[i] <= 0) {
                particles[i] = emitter.copy();
                ages[i] = 1000;
            } else { ages[i] -= 1 }
        }
    };

    p.windowResized = function () {
        winW = p.windowWidth;
        winH = p.windowHeight;
        p.resizeCanvas(winW, winH);
        winW = p.windowWidth;
        winH = p.windowHeight;
        emitter = p.createVector(Math.random() * winW, Math.random() * winH);
    };

    /**
    * Find the curl of the gradient of a potential field via finite difference.
    *
    * This function is designed for use in p5js sketches, and thus requires a
    * p5js drawing context to be passed in, which is used to get the Vector
    * creation function.
    *
    * @param [x] The x component of location to sample potential.
    * @param [y] The y component of the location to sample potential.
    * @param [t] The time component used to sample potential.
    * @param [pFunc] The potential field function. Takes 4 args, the first 2
    * representing an (x, y) coordinate in 2D sample space, the 3rd representing
    * time, and the 4th being a p5js drawing context. Should return the
    * potential at the corresponding point in 2D space-time.
    * @param [p5Context] A p5js drawing context.
    * @param [epsilon] Optional epsilon (infinitesimal) value; defaults to 1.
    * @return A vector representing the curl at the given location.
    */
    function curl(x, y, t, pFunc, p5Context, epsilon = 1) {
        var n1, n2, a, b;
        // Change in x with regard to y.
        n1 = pFunc(x, (y + epsilon), t, p5Context);
        n2 = pFunc(x, (y - epsilon), t, p5Context);
        a = (n1 - n2)/(2 * epsilon);
        // Change in y with regard to x.
        n1 = pFunc((x + epsilon), y, t, p5Context);
        n2 = pFunc((x - epsilon), y, t, p5Context);
        b = (n1 - n2)/(2 * epsilon);
        return p5Context.createVector(a, -b);
    }

    /**
    * Return a patterned random potential for a position in 2D space-time.
    *
    * @param [x] The x coordinate of a point in p5js's drawing space.
    * @param [y] The y coordinate of a point in p5js's drawing space.
    * @param [t] The time component; meant for use with p5js's frameCount.
    * @param [p5js] A p5js drawing context.
    */
    function rampedPerlinPotential(x, y, t, p5js) {
      var k = 0.001,
          margin = 16,
          v = p5js.createVector(x, y),
          scaledNoise = p5js.noise(x * k, y * k, t * k);

      var left = smoothRamp(p5js.map(x, 0, margin, 0, 1)),
          right = smoothRamp(p5js.map(p5js.width - x, 0, margin, 0, 1)),
          top = smoothRamp(p5js.map(y, 0, margin, 0, 1)),
          bottom = smoothRamp(p5js.map(p5js.height - y, 0, margin, 0, 1));

      return (scaledNoise * left * right * top * bottom);
    }

    /**
     * Smoothly ramp an input (from 0 to 1) from -1 to 1.
     */
    function smoothRamp(n) {
      var r = (n * 2) - 1;
      if (r >= 1) {
        return 1;
      }
      if (r <= -1) {
        return -1;
      }
      return ((15 / 8) * r
              - (10 / 8) * Math.pow(r, 3)
              + (3 / 8) * Math.pow(r, 5));
    }

    /**
    * Keep particles inside the barrier.
    */
    function contain(v, i) {
        var d = p.createVector(0, 0);
        // Check if particle has moved outside of one of the side boundaries.
        if (v.x <= MARGIN) {
          d.add(p.createVector(MARGIN - v.x, 0));
        } else if (v.x >= winW - MARGIN) {
          d.add(p.createVector(v.x, 0));
        }
        // Check if particle has moved outside of the top or bottom boundary.
        if (v.y <= MARGIN) {
          d.add(p.createVector(0, MARGIN - v.y));
        } else if (v.y >= winH - MARGIN) {
          d.add(p.createVector(0, v.y));
        }
        v.add(d);
    }
};
