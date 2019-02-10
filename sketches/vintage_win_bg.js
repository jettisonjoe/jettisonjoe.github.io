var sketch = function (p) {
  const BG_COLOR = '#839496';

  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#586e75';
  const FONT_SIZE = 33;

  const ICON_SIZE = 112;
  const ICON_MARGIN = 80;
  const NUM_ICONS = 2;
  const TEXT_OFFSET = 40;

  const LOADING_BAR_PATH = 'assets/img/loading_bar.gif'

  var font, selectedIconIdx;

  p.preload = function () {
    font = p.loadFont(FONT_PATH);
    loadingBarImg = p.loadImage(LOADING_BAR_PATH)
  }

  p.draw = function () {
    p.noLoop();
    p.noStroke();

    p.background(BG_COLOR);
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);

    p.image(
        loadingBarImg,
        p.windowWidth/2 - loadingBarImg.width/2,
        p.windowHeight/2 - loadingBarImg.height/2);
    // p.text("please wait...");
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
