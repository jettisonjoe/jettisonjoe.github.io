var sketch = function (p) {
  const BG_COLOR = '#839496';
  const OUTLINE_COLOR = "#073642";
  const SHADOW_COLOR = '#002b36';

  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#073642';
  const FONT_SIZE = 33;

  const BORDER_SIZE = 4;
  const SHADOW_SIZE = 8;

  const LOADING_BAR_PATH = 'assets/img/loading_bar.gif'

  var font,
      loadingBarImg;

  p.preload = function () {
    font = p.loadFont(FONT_PATH);
    loadingBarImg = p.createImg(LOADING_BAR_PATH)
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
    p.noStroke();
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);
  };

  p.draw = function () {
    p.noLoop();
    p.fill(SHADOW_COLOR);
    p.rect(
        SHADOW_SIZE, SHADOW_SIZE,
        p.windowWidth - SHADOW_SIZE,
        p.windowHeight - SHADOW_SIZE);
    p.fill(OUTLINE_COLOR);
    p.rect(
        0, 0,
        p.windowWidth - SHADOW_SIZE,
        p.windowHeight - SHADOW_SIZE);
    p.fill(BG_COLOR);
    p.rect(
        BORDER_SIZE, BORDER_SIZE,
        p.windowWidth - SHADOW_SIZE - 2 * BORDER_SIZE,
        p.windowHeight - SHADOW_SIZE - 2 * BORDER_SIZE);
    p.fill(FONT_COLOR);
    p.text(
      "please wait...",
      p.windowWidth/2,
      p.windowHeight/2 + loadingBarImg.height + FONT_SIZE);
    loadingBarImg.position(
        p.windowWidth/2 - loadingBarImg.width/2,
        p.windowHeight/2 - loadingBarImg.height/2);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
