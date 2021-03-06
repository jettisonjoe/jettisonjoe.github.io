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
      loadingBarImg,
      width,
      height;

  p.preload = function () {
    font = p.loadFont(FONT_PATH);
    loadingBarImg = p.createImg(LOADING_BAR_PATH);
    width = parseInt(url.searchParams.get('width'));
    height = parseInt(url.searchParams.get('height'));
  }

  p.setup = function () {
    width = width || p.windowWidth;
    height = height || p.windowHeight;
    p.createCanvas(width, height);
    p.imageMode(p.CORNER);
    p.noStroke();
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);
  };

  p.draw = function () {
    // For unknown reasons, the image size computes to zero for the first dozen
    // or so frames. Maybe one loop through the animation.
    if (p.frameCount > 120) {
      p.noLoop();
    }
    p.fill(SHADOW_COLOR);
    p.rect(
        SHADOW_SIZE,
        SHADOW_SIZE,
        width - SHADOW_SIZE,
        height - SHADOW_SIZE);
    p.fill(OUTLINE_COLOR);
    p.rect(
        0,
        0,
        width - SHADOW_SIZE,
        height - SHADOW_SIZE);
    p.fill(BG_COLOR);
    p.rect(
        BORDER_SIZE,
        BORDER_SIZE,
        width - SHADOW_SIZE - 2 * BORDER_SIZE,
        height - SHADOW_SIZE - 2 * BORDER_SIZE);
    p.fill(FONT_COLOR);
    p.text(
        "please wait...",
        width / 2,
        height / 2 + loadingBarImg.height + FONT_SIZE);
    loadingBarImg.position(
        width / 2 - loadingBarImg.width / 2,
        height / 2 - loadingBarImg.height / 2);
  };

  p.windowResized = function () {
    width = parseInt(url.searchParams.get('width'));
    height = parseInt(url.searchParams.get('height'));
    width = width || p.windowWidth;
    height = height || p.windowHeight;
    p.resizeCanvas(width, height);
    p.loop();
  };
}
