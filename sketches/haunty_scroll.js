var sketch = function (p) {
  const LEFT_PATH = 'assets/img/haunty_scroll_left.png';
  const RIGHT_PATH = 'assets/img/haunty_scroll_right.png';
  const MID_PATH = 'assets/img/haunty_scroll_mid.png';
  const FONT_PATH = 'assets/fonts/Alagard_by_pix3m.ttf'
  const FONT_SIZE = 48;
  const TITLE_Y_COORD = 73;
  const TITLE_MARGIN = 30;

  let leftImg,
      rightImg,
      midImg,
      font,
      fontColor,
      text;

  p.preload = function () {
    leftImg = p.loadImage(LEFT_PATH);
    rightImg = p.loadImage(RIGHT_PATH);
    midImg = p.loadImage(MID_PATH);
    font = p.loadFont(FONT_PATH);

    fontColor = url.searchParams.get('color') || '606060';
    fontColor = '#' + fontColor;
    text = url.searchParams.get('text') || '';
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    p.noLoop();
    p.image(leftImg, 0, 0);
    p.image(
        midImg,
        leftImg.width,
        0,
        p.windowWidth - leftImg.width - rightImg.width,
        midImg.height);
    p.image(rightImg, p.windowWidth - rightImg.width, 0);

    p.fill(fontColor);
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);
    let textHeight = (font.textBounds(text, 0, 0, FONT_SIZE)).h
    p.text(text, p.windowWidth / 2, TITLE_Y_COORD);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.Loop();
  };
}
