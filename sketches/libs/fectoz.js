class Starfield {
  static get MAX_ROT_SPEED() { return 0.001; }
  static get MAX_STARS() { return 30000; }
  static get MAX_STARS_PER_PX() { return 0.001; }
  static get MAX_STAR_SIZE() { return 5; }

  constructor(p, x, y, r, density, rotSpeed) {
    this.pos = p.createVector(x, y);
    this._stars = [];
    this._rotation = 0;
    this._rotSpeed = p.constrain(
        rotSpeed * Starfield.MAX_ROT_SPEED,
        0,
        Starfield.MAX_ROT_SPEED);
    p.angleMode(p.RADIANS);
    let area = Math.PI * p.sq(r);
    let numStars = p.constrain(
        area * density * Starfield.MAX_STARS_PER_PX,
        0,
        Starfield.MAX_STARS);
    for (var i = 0; i < numStars; i++) {
      var newStar = {
            pos: p.createVector(1, 1),
            size: p.random(1, Starfield.MAX_STAR_SIZE),
          };
      newStar.pos.setMag(r * p.sqrt(p.random()));
      newStar.pos.rotate(p.random(2 * Math.PI));
      this._stars.push(newStar);
    }
  }

  draw(p) {
    p.push();
    this._rotation -= this._rotSpeed;
    p.push();
    p.translate(this.pos.x, this.pos.y);
    p.angleMode(p.RADIANS);
    p.rotate(this._rotation);
    p.stroke(255);
    this._stars.forEach(function(star) {
      p.strokeWeight(star.size + p.random(-0.5, 0.5));
      p.point(star.pos.x, star.pos.y);
    });
    p.pop();
    p.pop();
  }
}


class ScrollingGradient {
  static get SCROLL_SPEED() { return 0.25; }

  constructor(p, x, y, w, h, gradientHeight, colorScale) {
    this.pos = p.createVector(x, y);
    this.size = p.createVector(w, h);
    this._scroll = 0;
    this._maxScroll = 2 * gradientHeight;

    let gradient = createGradient(p, w, gradientHeight, colorScale);
    this._graphics = p.createGraphics(w, this._maxScroll + h);
    this._graphics.clear();
    this._graphics.image(gradient, 0, 0);
    this._graphics.push();
    this._graphics.translate(w, this._maxScroll);
    this._graphics.angleMode(p.RADIANS);
    this._graphics.rotate(Math.PI);
    this._graphics.image(gradient, 0, 0);
    this._graphics.pop();
    this._graphics.image(
        gradient,
        0, this._maxScroll,
        w, h,
        0, 0,
        w, h);
  }

  draw(p) {
    p.push();
    p.image(
        this._graphics,
        this.pos.x, this.pos.y,
        this.size.x, this.size.y,
        0, this._scroll,
        this.size.x, this.size.y);
    this._scroll += ScrollingGradient.SCROLL_SPEED;
    if (this._scroll >= this._maxScroll) {
      this._scroll = 0;
    }
    p.pop();
  }
}


function createGradient(p, w, h, colorScale) {
  let img = p.createImage(w, h);
  let noiseScale = 0.004;
  img.loadPixels();
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      let colorIndex = p.constrain(
          (y / h) + 0.12 * p.noise(noiseScale * x, noiseScale * y), 0, 1);
      img.set(x, y, p.color(colorScale(colorIndex).rgb()));
    }
  }
  img.updatePixels();
  return img;
}


function createRandomBalancedScale(numColors, modeString) {
  let colors = [];
  for (var i = 0; i < numColors; i++) {
    colors.push(chroma.random());
  }
  colors.sort(function(a, b) {
    return a.get('hsl.l') - b.get('hsl.l');
  });
  if (Math.random() > 0.5) { colors.reverse(); }
  let bez = chroma.bezier(colors);
  if (modeString) {
    return chroma.scale(bez).mode(modeString);
  }
  return chroma.scale(bez).mode('lrgb').padding(0.1);
}
