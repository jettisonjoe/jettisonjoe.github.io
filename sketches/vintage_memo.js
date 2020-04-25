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
  const MEMO_DOGEAR_PATH = 'assets/img/vintage_memo_dogear.png';
  const MEMO_BOTTOM_PATH = 'assets/img/vintage_memo_bottom.png';

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
      memoDogearImg,
      memoBottomImg,
      titleText,
      font,
      width,
      height;

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
    memoDogearImg = p.loadImage(MEMO_DOGEAR_PATH);
    memoBottomImg = p.loadImage(MEMO_BOTTOM_PATH);

    titleText = url.searchParams.get("title");
    font = p.loadFont(FONT_PATH);

    width = parseInt(url.searchParams.get('width'));
    height = parseInt(url.searchParams.get('height'));
  }

  p.setup = function () {
    width = width || p.windowWidth;
    height = height || p.windowHeight;
    p.createCanvas(width, height);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    p.noLoop();
    p.background("#eee8d5");
    p.image(topLeftImg, 0, 0);
    p.image(topRightImg, width - topRightImg.width, 0);
    p.image(topImg,
            topLeftImg.width,
            0,
            width - topRightImg.width - topLeftImg.width,
            topImg.height);
    p.image(bottomLeftImg, 0, height - bottomLeftImg.height);
    p.image(bottomRightImg,
            width - bottomRightImg.width,
            height - bottomRightImg.height);
    p.image(bottomImg,
            bottomLeftImg.width,
            height - bottomImg.height,
            width - bottomLeftImg.width - bottomRightImg.width,
            bottomImg.height);
    p.image(leftSideImg,
            0,
            topLeftImg.height,
            leftSideImg.width,
            height - topLeftImg.height - bottomLeftImg.height);
    p.image(rightSideImg,
            width - leftSideImg.width,
            topRightImg.height,
            leftSideImg.width,
            height - topRightImg.height - bottomRightImg.height);
    p.image(memoDogearImg,
            leftSideImg.width,
            height - bottomImg.height - memoDogearImg.height);
    p.image(
        memoBottomImg,
        leftSideImg.width + memoDogearImg.width,
        height - bottomImg.height - memoBottomImg.height,
        width - leftSideImg.width - rightSideImg.width - memoDogearImg.width,
        memoBottomImg.height);

    if (titleText) {
      var titleSidesWidth = titleLeftImg.width + titleRightImg.width;
      var topCornersWidth = topLeftImg.width + topRightImg.width;
      var titleMax = width - titleSidesWidth - topCornersWidth;
      var titleWidth = (font.textBounds(titleText, 0, 0, FONT_SIZE).w +
                        TITLE_MARGIN * 2);
      if (titleWidth <= titleMax) {
        p.image(titleLeftImg,
                width/2 - titleWidth/2 - titleLeftImg.width,
                0);
        p.image(titleRightImg,
                width/2 + titleWidth/2,
                0);
        p.image(titleImg,
                width/2 - titleWidth/2,
                0,
                titleWidth,
                titleImg.height);
        p.fill(FONT_COLOR);
        p.textFont(font);
        p.textSize(FONT_SIZE);
        p.textAlign(p.CENTER);
        p.text(titleText, width/2, 30);
      }
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(width, height);
    p.Loop();
  };
}
