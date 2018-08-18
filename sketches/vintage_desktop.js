var sketch = function (p) {
  const BG_COLOR = '#657b83';

  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#93a1a1';
  const FONT_SIZE = 33;

  const ICON_SIZE = 112;
  const ICON_MARGIN = 80;
  const NUM_ICONS = 2;
  const TEXT_OFFSET = 40;
  const SELECTION_COLOR = '#073642';
  const SELECTION_MARGIN = 6;

  const ICON_STRINGS = ['Joyport 1', 'Disk A'];
  const ICON_PATHS = [
    'assets/img/joystick_icon.png',
    'assets/img/disk_icon.png',
  ];

  var font, selectedIconIdx;
  var xCoords = [];
  var yCoords = [];
  var icons = [];

  p.preload = function () {
    font = p.loadFont(FONT_PATH);
    for (var i = 0; i < NUM_ICONS; i++) {
      icons.push(p.loadImage(ICON_PATHS[i]));
    }

    selectedIconIdx = url.searchParams.get('select') || 0;
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CORNER);

    for (var i = 0; i < p.windowWidth; i += ICON_SIZE + ICON_MARGIN) {
      for (var j = 0; j < p.windowHeight; j += ICON_SIZE + ICON_MARGIN) {
        yCoords.push(p.windowHeight - i - ICON_SIZE - ICON_MARGIN);
        xCoords.push(p.windowWidth - j - ICON_SIZE - ICON_MARGIN);
      }
    }
  };

  p.draw = function () {
    p.noLoop();
    p.noStroke();

    p.background(BG_COLOR);
    p.textFont(font);
    p.textSize(FONT_SIZE);
    p.textAlign(p.CENTER);

    for (var k = 0; k < NUM_ICONS; k++) {
      p.image(icons[k], xCoords[k], yCoords[k]);
      if (k == selectedIconIdx) {
        var box = font.textBounds(ICON_STRINGS[k],
                                  xCoords[k] + ICON_SIZE/2,
                                  yCoords[k] + ICON_SIZE + TEXT_OFFSET,
                                  FONT_SIZE);
        p.fill(SELECTION_COLOR);
        p.rect(box.x - SELECTION_MARGIN - 1,
               box.y - SELECTION_MARGIN,
               box.w + 2 * SELECTION_MARGIN,
               box.h + 2 * SELECTION_MARGIN);
      }
      p.fill(FONT_COLOR);
      p.text(ICON_STRINGS[k],
             xCoords[k] + ICON_SIZE/2,
             yCoords[k] + ICON_SIZE + TEXT_OFFSET);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.loop();
  };
}
