var sketch = function (p) {
  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#93a1a1';
  const FONT_SIZE = 33;

  const BG_COLOR = '#657b83';

  var font;

  p.preload = function () {
    font = p.loadFont(FONT_PATH);
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    p.noLoop();

    p.background(BG_COLOR);

    p.fill(FONT_COLOR);
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);
    p.text('HACKABEES', p.windowWidth/2, p.windowWidth/2);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
