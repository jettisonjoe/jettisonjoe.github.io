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
      rightSideImg,
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
    p.image(topLeftImg, 0, 0);
    p.image(topRightImg,width - topRightImg.width, 0);
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
  };

  p.windowResized = function () {
    width = parseInt(url.searchParams.get('width'));
    height = parseInt(url.searchParams.get('height'));
    width = width || p.windowWidth;
    height = height || p.windowHeight;
    p.resizeCanvas(width, height);
    p.Loop();
  };
}
