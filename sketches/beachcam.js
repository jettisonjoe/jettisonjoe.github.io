var sketch = function (p) {
  const WATER_RATIO = 0.3;
  const SCALE_DIVISOR = 3;
  
  let gradient,
      starfield,
      foreground,
      buffer,
      water,
      lightOrigin;

  p.preload = function() {
    foreground = p.loadImage('assets/img/beach_silhouettes.png');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    let skyWidth = Math.ceil(p.windowWidth / SCALE_DIVISOR);
    let skyHeight = Math.ceil(
        ((1 - WATER_RATIO) * p.windowHeight) / SCALE_DIVISOR);
    buffer = p.createGraphics(skyWidth, skyHeight);
    water = new Water(
        p,
        buffer,
        Math.ceil(WATER_RATIO * p.windowHeight / SCALE_DIVISOR) + 1);
    gradient = new ScrollingGradient(
        p,
        skyWidth, skyHeight,
        (p.windowHeight / 3) * 2,
        createRandomBalancedScale(4));
    p.imageMode(p.CORNER);
    starfield = new Starfield(
        p,
        Math.sqrt(skyWidth * skyWidth + skyHeight * skyHeight),
        0.8, 0.05);
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

    p.push();
    p.noSmooth();
    p.scale(3);
    p.image(buffer, 0, 0);
    p.translate(0, buffer.height - 1);
    water.drawAt(p, 0, 0);
    p.pop();

    p.image(foreground, 0, p.windowHeight - foreground.height);
    // console.log(p.frameRate());
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
