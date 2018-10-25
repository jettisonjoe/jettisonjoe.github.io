class Starfield {
  static get MAX_STARS_PER_PX { return 1; }
  static get MAX_ROT_SPEED { return 1; }

  constructor(p, x, y, r, density, starSize, rotSpeed) {
    this.pos = p.createVector(x, y);
    this._stars = [];
    this._rotation = 0;
    this._rotSpeed = rotSpeed * Starfield.MAX_ROT_SPEED;
    
    p.angleMode(p.RADIANS);
    var numStars = Math.PI * radius^2 * density * Starfield.MAX_STARS_PER_PX;
    for (var i = 0; i < numStars; i++) {
      var newStar = p.createVector();
      newStar.setMag(p.random(radius));
      newStar.rotate(p.random(2 * Math.PI));
      this._stars.push(newStar);
    }
  }

  draw(p) {
    p.push();
    this._rotation -= this._rotSpeed;
    p.rotate(this._rotation);
    p.translate(this.pos.x, this.pos.y);
    p.stroke(255);
    for (var i = 0; i < this._stars.length; i++) {
      p.strokeWeight(this._stars[i].z + p.random() - 0.5);
      p.point(this._stars[i].x, this.stars[i].y);
    }
    p.pop();
  }
} 

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
    function setScale(numColors) {
        var colors = [];
        for (var i = 0; i < numColors; i++) {
            colors.push(chroma.random());
        }
        if (p.random() > 0.5) {
            colors.sort(function(a, b) {
              return b.get('hcl.l') - a.get('hcl.l');
            });
        } else {
            colors.sort(function(a, b) {
                return a.get('hcl.l') - b.get('hcl.l');
            });
        }
        return chroma.scale(
            chroma.bezier(colors))
                .correctLightness(true)
                .padding(0.15);
    }
}
