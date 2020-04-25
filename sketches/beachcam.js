var sketch = function (p) {
  // How far up the screen the water goes. 0 is all sky, 1 is all water.
  const WATER_RATIO = 0.3;
  // Each "pixel" of the image will be this many real pixels across.
  const PIXELATION = 3;
  const FOREGROUND_IMAGE = 'assets/img/beach_silhouettes.png';
  const STARFIELD_DENSITY = 0.8;
  const STARFIELD_ROTATION_SPEED = 0.05;
  
  let gradient,
      starfield,
      foreground,
      buffer,
      water,
      lightOrigin;

  p.preload = function() {
    foreground = p.loadImage(FOREGROUND_IMAGE);
  }

  p.setup = function () {
    p.imageMode(p.CORNER);
    let width = p.min(p.windowWidth, foreground.width);
    p.createCanvas(width, p.windowHeight);
    let bufferWidth = Math.ceil(width / PIXELATION);
    let bufferHeight = Math.ceil(
        ((1 - WATER_RATIO) * p.windowHeight) / PIXELATION);
    buffer = p.createGraphics(bufferWidth, bufferHeight);
    water = new Water(
        p,
        buffer,
        Math.ceil(WATER_RATIO * p.windowHeight / PIXELATION) + 1);
    gradient = new ScrollingGradient(
        p,
        bufferWidth, bufferHeight,
        (p.windowHeight / PIXELATION) * 2,
        createRandomBalancedScale(4));
    starfield = new Starfield(
        p,
        Math.sqrt(bufferWidth * bufferWidth + bufferHeight * bufferHeight),
        STARFIELD_DENSITY,
        STARFIELD_ROTATION_SPEED);
    lightOrigin = p.createVector(
        p.random(buffer.width),
        p.random(buffer.height));
  };

  p.draw = function () {
    // Fade-in.
    if (p.frameCount <= 255) {
      p.tint(255, p.frameCount);
    }

    gradient.drawAt(buffer, 0, 0);
    starfield.drawAt(buffer, 0, 0);

    buffer.ellipseMode(p.CENTER);
    buffer.noStroke();
    buffer.fill(255, 255, 255, 1);
    for (var i = buffer.width * 1.5; i >= 0; i = i - 32) {
      buffer.ellipse(lightOrigin.x, lightOrigin.y, i, i);
    }

    p.push();
    p.noSmooth();
    p.scale(PIXELATION);
    p.image(buffer, 0, 0);
    p.translate(0, buffer.height - 1);
    water.drawAt(p, 0, 0);
    p.pop();

    p.image(foreground, 0, p.windowHeight - foreground.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
