var sketch = function (p) {
  var graphic,
      water;

  p.preload = function() {
    graphic = p.loadImage('assets/img/beachcam_sample.png');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
    water = p.createImage(graphic.width, p.windowHeight - graphic.height);
  };

  p.draw = function () {
    p.background(255);
    graphic.loadPixels();
    water.loadPixels();
    var src, dest;
    for (var y = 0; y < water.height; y++) {
      for (var x = 0; x < water.width; x++) {
        src = 4 * ((graphic.height - y) * water.width + x);
        src -= Math.floor(p.random(8)) * (4 * (water.width));
        dest = 4 * (y * water.width + x);
        water.pixels[dest] = graphic.pixels[src];
        water.pixels[dest + 1] = graphic.pixels[src + 1];
        water.pixels[dest + 2] = graphic.pixels[src + 2];
        water.pixels[dest + 3] = graphic.pixels[src + 3] * 0.8;
      }
    }
    water.updatePixels();
    p.image(graphic, 0, 0);
    p.image(water, 0, graphic.height - 1);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
