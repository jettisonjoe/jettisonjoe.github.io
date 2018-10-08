var sketch = function (p) {
  const CAMPAIGN_DATA_URL = 'http://scrato.jettisonjoe.com/krista-and-luis';
  const FONT_PATH = 'assets/fonts/Audiowide-Regular.ttf';
  const FONT_COLOR = '#ffffff';
  const FONT_SIZE_LINE_1 = 33;
  const FONT_SIZE_LINE_2 = 55;
  const LINE_1_INDENT = 8;
  const LINE_2_INDENT = 20;
  const LINE_1_Y = 0;
  const LINE_2_Y = FONT_SIZE_LINE_1 + 2 * LINE_1_Y;

  const TITLE_BG_PATH = 'assets/img/futuristic_title_bg.png';
  const TITLE_RIGHT_PATH = 'assets/img/futuristic_title_right.png';

  var startPolling = function(func) {

  };

  var titleBgImg,
      titleRightImg,
      line1Text,
      line2Text,
      font;

  // var pollOnce = function() {
  //   p.httpGet(
  //       'http://scrato.jettisonjoe.com/krista-and-luis',
  //       'json',
  //       false,
  //       function(response) {
  //         line1Text = response.goal.toString();
  //         line2Text = response.raised.toString();
  //         p.loop();
  //       });
  // };

  p.preload = function () {
    titleBgImg = p.loadImage(TITLE_BG_PATH);
    titleRightImg = p.loadImage(TITLE_RIGHT_PATH);

    line1Text = url.searchParams.get("line1") || " ";
    line2Text = url.searchParams.get("line2") || " ";
    font = p.loadFont(FONT_PATH);
    p.httpGet(
        CAMPAIGN_DATA_URL,
        'json',
        false,
        function(response) {
          line1Text = response.goal.toString();
          line2Text = response.raised.toString();
        });
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    var line1Bounds = font.textBounds(line1Text, 0, 0, FONT_SIZE_LINE_1);
    var line2Bounds = font.textBounds(line2Text, 0, 0, FONT_SIZE_LINE_2);
    var textWidth = p.max(line1Bounds.w + LINE_1_INDENT,
                             line2Bounds.w + LINE_2_INDENT);

    p.background(127);
    p.tint(255,90);
    p.image(titleBgImg, 0, 0, textWidth, titleBgImg.height);
    p.image(titleRightImg, textWidth, 0);
    p.tint(255,255);
    p.fill(FONT_COLOR);
    p.textAlign(p.LEFT, p.TOP);
    p.textFont(font);
    p.textSize(FONT_SIZE_LINE_1);
    p.text(line1Text, LINE_1_INDENT, LINE_1_Y);
    p.textSize(FONT_SIZE_LINE_2);
    p.text(line2Text, LINE_2_INDENT, LINE_2_Y);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
