class Starfield {
  static get MAX_ROT_SPEED() { return 0.001; }
  static get MAX_STARS() { return 30000; }
  static get MAX_STARS_PER_PX() { return 0.001; }
  static get MAX_STAR_SIZE() { return 2; }

  constructor(p, r, density, rotSpeed) {
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

  drawAt(p, x, y) {
    p.push();
    p.translate(x, y);
    this._rotation -= this._rotSpeed;
    p.angleMode(p.RADIANS);
    p.rotate(this._rotation);
    p.stroke(255);
    this._stars.forEach(function(star) {
      p.strokeWeight(star.size + (Math.random() - 0.5) / 5);
      p.point(star.pos.x, star.pos.y);
    });
    p.pop();
  }
}


class ScrollingGradient {
  static get SCROLL_SPEED() { return 0.35; }

  constructor(p, w, h, gradientHeight, colorScale) {
    this._speed = parseFloat(url.searchParams.get('speed')) || 1;

    this.size = p.createVector(p.ceil(w), p.ceil(h));
    this._scroll = 0;
    this._maxScroll = 2 * p.ceil(gradientHeight);

    let gradient = createGradient(
        p, p.ceil(w), p.ceil(gradientHeight), colorScale);
    this._graphics = p.createGraphics(
        p.ceil(w), this._maxScroll + p.ceil(h));
    this._graphics.clear();
    this._graphics.image(gradient, 0, 0);
    this._graphics.push();
    this._graphics.translate(0, this._maxScroll);
    this._graphics.scale(1, -1);
    this._graphics.image(gradient, 0, 0);
    this._graphics.pop();
    this._graphics.image(
        gradient,
        0, this._maxScroll,
        p.ceil(w), p.ceil(h),
        0, 0,
        p.ceil(w), p.ceil(h));
  }

  drawAt(p, x, y) {
    p.image(
        this._graphics,
        x, y,
        this.size.x, this.size.y,
        0, this._scroll,
        this.size.x, this.size.y);
    this._scroll += ScrollingGradient.SCROLL_SPEED;
    if (this._scroll >= this._maxScroll) {
      this._scroll = 0;
    }
  }
}


function createGradient(p, w, h, colorScale) {
  let img = p.createImage(w, h);
  let noiseScale = 0.004;
  img.loadPixels();
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      let idx = 4 * (y * img.width + x);
      let colorIndex = p.constrain(
          (y / h) + 0.12 * p.noise(noiseScale * x, noiseScale * y), 0, 1);
      let color = colorScale(colorIndex);
      img.pixels[idx] = color.get('rgb.r');
      img.pixels[idx + 1] = color.get('rgb.g');
      img.pixels[idx + 2] = color.get('rgb.b');
      img.pixels[idx + 3] = 255;
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


function colorScaleFromString(colorScaleString, modeString) {
    let colorStrings = colorScaleString.split(',');
    let colors = [];
    for (var i = 0; i < colorStrings.length; i++) {
      colors.push(chroma('#' + colorStrings[i]));
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


class Water {
  constructor(p, sourceImage, h) {
    this._sourceImage = sourceImage;
    this._image = p.createImage(sourceImage.width, h);
  }

  drawAt(p, posX, posY) {
    this._sourceImage.loadPixels();
    this._image.loadPixels();
    var src, dest;
    for (var y = 0; y < this._image.height; y++) {
      for (var x = 0; x < this._image.width; x++) {
        dest = 4 * (y * this._image.width + x);
        src = 4 * ((this._sourceImage.height - y) * this._image.width + x);
        src -= Math.floor(Math.random() * 16) * (4 * (this._image.width));
        this._image.pixels[dest] = this._sourceImage.pixels[src];
        this._image.pixels[dest + 1] = this._sourceImage.pixels[src + 1];
        this._image.pixels[dest + 2] = this._sourceImage.pixels[src + 2];
        this._image.pixels[dest + 3] = this._sourceImage.pixels[src + 3] * 0.8;
      }
    }
    this._image.updatePixels();
    p.image(this._image, posX, posY);
    p.noStroke();
    p.fill(0, 15, 30, 40);
    p.rect(posX, posY, this._image.width, this._image.height);
  }
}


class Mist {
  static get NOISE_SCALE() { return 0.1; }

  constructor(p, w, h, size, speed, colorString) {
    this._rowCount = Math.ceil(h / size);
    this._columnCount = Math.ceil(w / size);
    this._size = size;
    this._speed = speed;
    this._t = 0;
    this._c = chroma(colorString).rgb();
  }

  drawAt(p, posX, posY) {
    p.push();
    p.translate(posX, posY);
    p.noStroke();
    let yNoise = this._t;
    for (let row = 0; row < this._rowCount; row++) {
      let xNoise = this._t;
      for (let col = 0; col < this._columnCount; col++) {
        let x = col * this._size;
        let y = row * this._size;
        p.fill(
            this._c[0],
            this._c[1],
            this._c[2],
            p.noise(xNoise, yNoise) * 255)
        p.rect(x, y, this._size, this._size);
        xNoise += Mist.NOISE_SCALE;
      }
      yNoise += Mist.NOISE_SCALE;
    }
    p.pop();
    this._t += 0.01 * this._speed;
  }
}
