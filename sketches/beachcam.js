var sketch = function (p) {
  var gradient,
      starfield,
      palmtree,
      lightOrigin;

  p.preload = function() {
    palmtree = p.loadImage('assets/img/palm_silhouette.png');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    gradient = new ScrollingGradient(
        p,
        0, 0,
        p.windowWidth, p.windowHeight,
        p.windowHeight * 2,
        createRandomBalancedScale(4));
    p.imageMode(p.CORNER);
    starfield = new Starfield(
        p,
        0, 0,
        p.max(p.windowWidth, p.windowHeight) * 2, 0.4, 0.03);
    lightOrigin = p.createVector(0, 0);
    lightOrigin.x = p.random(p.windowWidth);
    lightOrigin.y = p.random(p.windowHeight);
  };

  p.draw = function () {
    gradient.draw(p);
    p.stroke(0);
    starfield.draw(p);
    p.ellipseMode(p.CENTER);
    p.noStroke();
    p.fill(255, 255, 255, 1);
    for (var i = p.windowWidth * 1.5; i >= 0; i = i - 32) {
      p.ellipse(lightOrigin.x, lightOrigin.y, i, i);
    }
    p.image(palmtree, 20, p.windowHeight - palmtree.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
