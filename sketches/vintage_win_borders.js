var sketch = function (p) {
  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#93a1a1';
  const FONT_SIZE = 33;
  const TITLE_MARGIN = 30;

  const TOP_LEFT_PATH = 'assets/img/vintage_win_border_top_left.png';
  const TOP_RIGHT_PATH = 'assets/img/vintage_win_border_top_right.png';
  const TOP_PATH = 'assets/img/vintage_win_border_top.png';
  const BOTTOM_LEFT_PATH = 'assets/img/vintage_win_border_bottom_left.png';
  const BOTTOM_RIGHT_PATH = 'assets/img/vintage_win_border_bottom_right.png';
  const BOTTOM_PATH = 'assets/img/vintage_win_border_bottom.png';
  const LEFT_SIDE_PATH = 'assets/img/vintage_win_border_side.png';
  const RIGHT_SIDE_PATH = 'assets/img/vintage_win_border_side.png';
  const TITLE_LEFT_PATH = 'assets/img/vintage_win_border_title_left.png';
  const TITLE_RIGHT_PATH = 'assets/img/vintage_win_border_title_right.png';
  const TITLE_PATH = 'assets/img/vintage_win_border_title.png';

  var topLeftImg,
      topRightImg,
      topImg,
      bottomLeftImg,
      bottomRightImg,
      bottomImg,
      leftSideImg,
      rightSideImg,
      titleLeftImg,
      titleRightImg,
      titleImg,
      titleText,
      font;

  p.preload = function () {
    topLeftImg = p.loadImage(TOP_LEFT_PATH);
    topRightImg = p.loadImage(TOP_RIGHT_PATH);
    topImg = p.loadImage(TOP_PATH);
    bottomLeftImg = p.loadImage(BOTTOM_LEFT_PATH);
    bottomRightImg = p.loadImage(BOTTOM_RIGHT_PATH);
    bottomImg = p.loadImage(BOTTOM_PATH);
    leftSideImg = p.loadImage(LEFT_SIDE_PATH);
    rightSideImg = p.loadImage(RIGHT_SIDE_PATH);
    titleLeftImg = p.loadImage(TITLE_LEFT_PATH);
    titleRightImg = p.loadImage(TITLE_RIGHT_PATH);
    titleImg = p.loadImage(TITLE_PATH);

    titleText = url.searchParams.get("title");
    font = p.loadFont(FONT_PATH);
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    p.image(topLeftImg, 0, 0);
    p.image(topRightImg, p.windowWidth - topRightImg.width, 0);
    p.image(topImg,
            topLeftImg.width,
            0,
            p.windowWidth - topRightImg.width - topLeftImg.width,
            topImg.height);
    p.image(bottomLeftImg, 0, p.windowHeight - bottomLeftImg.height);
    p.image(bottomRightImg,
            p.windowWidth - bottomRightImg.width,
            p.windowHeight - bottomRightImg.height);
    p.image(bottomImg,
            bottomLeftImg.width,
            p.windowHeight - bottomImg.height,
            p.windowWidth - bottomLeftImg.width - bottomRightImg.width,
            bottomImg.height);
    p.image(leftSideImg,
            0,
            topLeftImg.height,
            leftSideImg.width,
            p.windowHeight - topLeftImg.height - bottomLeftImg.height);
    p.image(rightSideImg,
            p.windowWidth - leftSideImg.width,
            topRightImg.height,
            leftSideImg.width,
            p.windowHeight - topRightImg.height - bottomRightImg.height);

    if (titleText) {
      var titleSidesWidth = titleLeftImg.width + titleRightImg.width;
      var topCornersWidth = topLeftImg.width + topRightImg.width;
      var titleMax = p.windowWidth - titleSidesWidth - topCornersWidth;
      var titleWidth = (font.textBounds(titleText, 0, 0, FONT_SIZE).w +
                        TITLE_MARGIN * 2);
      if (titleWidth <= titleMax) {
        p.image(titleLeftImg,
                p.windowWidth/2 - titleWidth/2 - titleLeftImg.width,
                0);
        p.image(titleRightImg,
                p.windowWidth/2 + titleWidth/2,
                0);
        p.image(titleImg,
                p.windowWidth/2 - titleWidth/2,
                0,
                titleWidth,
                titleImg.height);
        p.fill(FONT_COLOR);
        p.textFont(font);
        p.textSize(FONT_SIZE);
        p.textAlign(p.CENTER);
        p.text(titleText, p.windowWidth/2, 30);
      }
    }
    p.noLoop();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
