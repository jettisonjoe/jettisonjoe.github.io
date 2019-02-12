var sketch = function (p) {
  const TOP_LEFT_PATH = 'assets/img/vintage_win_fullscreen_top_left.png';
  const TOP_RIGHT_PATH = 'assets/img/vintage_win_fullscreen_top_right.png';
  const TOP_PATH = 'assets/img/vintage_win_fullscreen_top.png';
  const BOTTOM_LEFT_PATH = 'assets/img/vintage_win_fullscreen_bottom_left.png';
  const BOTTOM_RIGHT_PATH = 'assets/img/vintage_win_fullscreen_bottom_right.png';
  const BOTTOM_PATH = 'assets/img/vintage_win_fullscreen_bottom.png';
  const LEFT_SIDE_PATH = 'assets/img/vintage_win_fullscreen_side.png';
  const RIGHT_SIDE_PATH = 'assets/img/vintage_win_fullscreen_side.png';

  var topLeftImg,
      topRightImg,
      topImg,
      bottomLeftImg,
      bottomRightImg,
      bottomImg,
      leftSideImg,
      rightSideImg;

  p.preload = function () {
    topLeftImg = p.loadImage(TOP_LEFT_PATH);
    topRightImg = p.loadImage(TOP_RIGHT_PATH);
    topImg = p.loadImage(TOP_PATH);
    bottomLeftImg = p.loadImage(BOTTOM_LEFT_PATH);
    bottomRightImg = p.loadImage(BOTTOM_RIGHT_PATH);
    bottomImg = p.loadImage(BOTTOM_PATH);
    leftSideImg = p.loadImage(LEFT_SIDE_PATH);
    rightSideImg = p.loadImage(RIGHT_SIDE_PATH);
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
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
