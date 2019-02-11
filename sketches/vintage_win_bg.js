var sketch = function (p) {
  const BG_COLOR = '#839496';

  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#073642';
  const FONT_SIZE = 33;

  const ICON_SIZE = 112;
  const ICON_MARGIN = 80;
  const NUM_ICONS = 2;
  const TEXT_OFFSET = 40;

  const LOADING_BAR_PATH = 'assets/img/loading_bar.gif'

  var font, loadingBarImg;

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
    if (p.frameCount > 300) {
      p.noLoop();
    }
    p.background(BG_COLOR);
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
    p.loop();
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
