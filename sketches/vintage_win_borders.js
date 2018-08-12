var sketch = function (p) {
  const DEFAULT_TITLE_WIDTH = 200;

  var topLeft,
      topRight,
      top,
      bottomLeft,
      bottomRight,
      bottom,
      side,
      titleLeft,
      titleRight,
      title;

  var titleWidth,
      titleSidesWidth,
      topCornersWidth,
      titleMax;

  var setTitleWidth = function() {
    titleSidesWidth = titleLeft.width + titleRight.width;
    topCornersWidth = topLeft.width + topRight.width;
    titleMax = p.windowWidth - titleSidesWidth - topCornersWidth;
    titleWidth = Math.min(
        url.searchParams.get("title_width") || DEFAULT_TITLE_WIDTH,
        titleMax);
  };

  p.preload = function () {
    topLeft = p.loadImage('assets/img/vintage_win_border_top_left.png');
    topRight = p.loadImage('assets/img/vintage_win_border_top_right.png');
    top = p.loadImage('assets/img/vintage_win_border_top.png');
    bottomLeft = p.loadImage('assets/img/vintage_win_border_bottom_left.png');
    bottomRight = p.loadImage(
        'assets/img/vintage_win_border_bottom_right.png');
    bottom = p.loadImage('assets/img/vintage_win_border_bottom.png');
    side = p.loadImage('assets/img/vintage_win_border_side.png');
    titleLeft = p.loadImage('assets/img/vintage_win_border_title_left.png');
    titleRight = p.loadImage('assets/img/vintage_win_border_title_right.png');
    title = p.loadImage('assets/img/vintage_win_border_title.png');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
    setTitleWidth();
  };

  p.draw = function () {
    p.image(topLeft, 0, 0);
    p.image(topRight, p.windowWidth - topRight.width, 0);
    p.image(top,
            topLeft.width,
            0,
            p.windowWidth - topRight.width - topLeft.width,
            top.height);
    p.image(bottomLeft, 0, p.windowHeight - bottomLeft.height);
    p.image(bottomRight,
            p.windowWidth - bottomRight.width,
            p.windowHeight - bottomRight.height);
    p.image(bottom,
            bottomLeft.width,
            p.windowHeight - bottom.height,
            p.windowWidth - bottomLeft.width - bottomRight.width,
            bottom.height);
    p.image(side,
            0,
            topLeft.height,
            side.width,
            p.windowHeight - topLeft.height - bottomLeft.height);
    p.image(side,
            p.windowWidth - side.width,
            topRight.height,
            side.width,
            p.windowHeight - topRight.height - bottomRight.height);
    p.image(titleLeft,
            p.windowWidth/2 - titleWidth/2 - titleLeft.width,
            0);
    p.image(titleRight,
            p.windowWidth/2 + titleWidth/2,
            0);
    p.image(title,
            p.windowWidth/2 - titleWidth/2,
            0,
            titleWidth,
            title.height);
    p.noLoop();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setTitleWidth();
    p.loop();
  };
}
