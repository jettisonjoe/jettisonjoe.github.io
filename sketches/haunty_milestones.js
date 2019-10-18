var sketch = function (p) {
  const LEFT_PATH = 'assets/img/haunty_scroll_left.png';
  const MID_PATH = 'assets/img/haunty_scroll_mid.png';
  const FONT_PATH = 'assets/fonts/Alagard_by_pix3m.ttf'
  const FONT_SIZE = 28;
  const LINE_ONE_HEIGHT = 48;
  const LINE_TWO_HEIGHT = 82;

  let leftImg,
      midImg,
      font,
      fontColor,
      milestones,
      nextMilestoneName,
      line_one = 'Next Milestone',
      line_two = '';

  p.preload = function () {
    leftImg = p.loadImage(LEFT_PATH);
    midImg = p.loadImage(MID_PATH);
    font = p.loadFont(FONT_PATH);

    fontColor = url.searchParams.get('color') || '808080';
    fontColor = '#' + fontColor;

    let campaignId = url.searchParams.get('campaign') || null;
    milestones = new TiltifyMilestones(
        campaignId,
        15000,
        'dc562006d8e12541ee7f83e33b449e5cb84dffcf1aa9c2979b4c6131e4992891');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);
    p.noSmooth();
    milestones.update(p); // Initial update.
  };

  p.draw = function () {
    milestones.update(p);
    if (!milestones.nextMilestone ||
        nextMilestoneName === milestones.nextMilestone.name) {
      return;
    }
    nextMilestoneName = milestones.nextMilestone.name;
    line_one = 'Next Milestone  ~  $' + milestones.nextMilestone.amount;
    line_two = nextMilestoneName;
    p.image(leftImg, 0, 0);
    p.push()
    p.translate(p.windowWidth, leftImg.height + 16);
    p.rotate(p.PI);
    p.image(leftImg, 0, 0);
    p.pop();
    p.image(
        midImg,
        leftImg.width,
        0,
        p.windowWidth - leftImg.width - leftImg.width,
        midImg.height);

    p.fill(fontColor);
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);
    p.text(line_one, p.windowWidth / 2, LINE_ONE_HEIGHT);
    p.text(line_two, p.windowWidth / 2, LINE_TWO_HEIGHT);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
