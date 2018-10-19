var sketch = function (p) {
  const BASE_IMG_PATH = 'assets/img/';

  var img = null;

  p.preload = function () {
    var source = url.searchParams.get('source');
    if (source) {
      img = p.loadImage(BASE_IMG_PATH + source);
    }
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    p.noLoop();
    p.clear();
    if (img) {
      p.image(img, 0, 0);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
