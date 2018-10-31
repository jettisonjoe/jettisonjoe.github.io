var sketch = function (p) {
  var gradient,
      starfield,
      palmtree,
      buffer,
      water,
      img,
      lightOrigin;

  p.preload = function() {
    palmtree = p.loadImage('assets/img/palm_silhouette.png');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    let skyWidth = Math.ceil(p.windowWidth / 2);
    let skyHeight = Math.ceil(0.7 * p.windowHeight / 2);
    buffer = p.createGraphics(skyWidth, skyHeight);
    img = p.createImage(skyWidth, skyHeight);
    water = p.createImage(skyWidth, Math.ceil(0.3 * p.windowHeight / 2) + 1);
    gradient = new ScrollingGradient(
        p,
        skyWidth, skyHeight,
        p.windowHeight * 2,
        createRandomBalancedScale(4));
    p.imageMode(p.CORNER);
    starfield = new Starfield(
        p,
        p.max(skyWidth, skyHeight) * 2, 0.6, 0.05);
    lightOrigin = p.createVector(0, 0);
    lightOrigin.x = p.random(buffer.width);
    lightOrigin.y = p.random(buffer.height);
  };

  p.draw = function () {
    gradient.drawAt(buffer, 0, 0);
    starfield.drawAt(buffer, 0, 0);

    buffer.stroke(0);
    buffer.ellipseMode(p.CENTER);
    buffer.noStroke();
    buffer.fill(255, 255, 255, 1);
    for (var i = buffer.width * 1.5; i >= 0; i = i - 32) {
      buffer.ellipse(lightOrigin.x, lightOrigin.y, i, i);
    }
    img.copy(
        buffer, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height);

    img.loadPixels();
    water.loadPixels();
    var src, dest;
    for (var y = 0; y < water.height; y++) {
      for (var x = 0; x < water.width; x++) {
        dest = 4 * (y * water.width + x);
        src = 4 * ((img.height - y) * water.width + x);
        src -= Math.floor(p.random(8)) * (4 * (water.width));
        water.pixels[dest] = img.pixels[src];
        water.pixels[dest + 1] = img.pixels[src + 1];
        water.pixels[dest + 2] = img.pixels[src + 2];
        water.pixels[dest + 3] = img.pixels[src + 3] * 0.8;
      }
    }
    water.updatePixels();

    p.push();
    p.noSmooth();
    p.scale(2);
    p.image(buffer, 0, 0);
    p.translate(0, buffer.height - 1);
    p.image(water, 0, 0);
    p.noStroke();
    p.fill(0, 15, 30, 40);
    p.rect(0, 0, water.width, water.height);
    p.pop();

    p.image(palmtree, 20, p.windowHeight - palmtree.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
