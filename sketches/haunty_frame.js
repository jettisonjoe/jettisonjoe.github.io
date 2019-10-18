var sketch = function (p) {
  const EDGE_PATH = 'assets/img/haunty_frame_edge.png';

  const CORNER_PATH = 'assets/img/haunty_frame_corner.png';
  const TOP_PATH = 'assets/img/haunty_frame_top.png';
  const BOT_PATH = 'assets/img/haunty_frame_bot.png';

  const LITE_CORNER_PATH = 'assets/img/haunty_frame_corner_lite.png';
  const LITE_TOP_PATH = 'assets/img/haunty_frame_top_lite.png';
  const LITE_BOT_PATH = 'assets/img/haunty_frame_bot_lite.png';

  let edgeImg,
      cornerImg,
      topImg,
      botImg;

  p.preload = function () {
    edgeImg = p.loadImage(EDGE_PATH);
    let style = url.searchParams.get('style') || '';
    if (style == 'lite') {
      cornerImg = p.loadImage(LITE_CORNER_PATH);
      topImg = p.loadImage(LITE_TOP_PATH);
      botImg = p.loadImage(LITE_BOT_PATH);
    } else {
      cornerImg = p.loadImage(CORNER_PATH);
      topImg = p.loadImage(TOP_PATH);
      botImg = p.loadImage(BOT_PATH);
    }
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
  };

  p.draw = function () {
    p.noLoop();
    p.image(edgeImg, 0, 0, p.windowWidth, edgeImg.height);
    p.push();
    p.translate(p.windowWidth, 0);
    p.rotate(p.PI / 2);
    p.image(edgeImg, 0, 0, p.windowHeight, edgeImg.height);
    p.push();
    p.translate(p.windowHeight, 0);
    p.rotate(p.PI / 2);
    p.image(edgeImg, 0, 0, p.windowWidth, edgeImg.height);
    p.push();
    p.translate(p.windowWidth, 0);
    p.rotate(p.PI / 2);
    p.image(edgeImg, 0, 0, p.windowHeight, edgeImg.height);
    p.pop();
    p.pop();
    p.pop();
    p.image(cornerImg, 0, 0);
    p.push();
    p.translate(p.windowWidth, 0);
    p.rotate(p.PI / 2);
    p.image(cornerImg, 0, 0);
    p.push();
    p.translate(p.windowHeight, 0);
    p.rotate(p.PI / 2);
    p.image(cornerImg, 0, 0);
    p.push();
    p.translate(p.windowWidth, 0);
    p.rotate(p.PI / 2);
    p.image(cornerImg, 0, 0);
    p.pop();
    p.pop();
    p.pop();
    p.image(topImg, p.windowWidth / 2 - topImg.width / 2, 0);
    if (p.windowWidth > 2 * cornerImg.width) {
      p.image(
          botImg,
          p.windowWidth / 2 - botImg.width / 2,
          p.windowHeight - botImg.height);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.Loop();
  };
}
