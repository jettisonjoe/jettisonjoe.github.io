var sketch = function (p) {
  var gradient,
      starfield,
      palmtree;

  p.preload = function() {
    palmtree = p.loadImage('/assets/img/palm_silhouette.png');
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
  };

  p.draw = function () {
    gradient.draw(p);
    starfield.draw(p);
    p.image(palmtree, 20, p.windowHeight - palmtree.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
