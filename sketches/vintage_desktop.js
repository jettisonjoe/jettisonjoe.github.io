var sketch = function (p) {
  const BG_COLOR = '#657b83';
  const BG_IMG_PATH = 'assets/img/vintage_bg_texture_1.png'

  const FONT_PATH = 'assets/fonts/gohufont-uni-11.ttf';
  const FONT_COLOR = '#93a1a1';
  const FONT_SIZE = 33;

  const ICON_SIZE = 112;
  const ICON_MARGIN = 80;
  const NUM_ICONS = 2;
  const TEXT_OFFSET = 40;
  const DARK_COLOR = '#073642';
  const LIGHT_COLOR = '#93a1a1';
  const SELECTION_MARGIN = 6;

  const ICON_STRINGS = ['Joyport 1', 'Disk A'];
  const ICON_PATHS = [
    'assets/img/joystick_icon.png',
    'assets/img/disk_icon.png',
  ];

  var font, selectedIconIdx, width, height;
  var xCoords = [];
  var yCoords = [];
  var icons = [];

  p.preload = function () {
    font = p.loadFont(FONT_PATH);
    bg_img = p.loadImage(BG_IMG_PATH);
    for (var i = 0; i < NUM_ICONS; i++) {
      icons.push(p.loadImage(ICON_PATHS[i]));
    }

    selectedIconIdx = url.searchParams.get('select') || 0;
    width = parseInt(url.searchParams.get('width'));
    height = parseInt(url.searchParams.get('height'));
  }

  p.setup = function () {
    width = width || p.windowWidth;
    height = height || p.windowHeight;
    p.createCanvas(width, height);
    p.imageMode(p.CORNER);

    for (var i = 0; i < width; i += ICON_SIZE + ICON_MARGIN) {
      for (var j = 0; j < height; j += ICON_SIZE + ICON_MARGIN) {
        yCoords.push(height - i - ICON_SIZE - ICON_MARGIN);
        xCoords.push(width - j - ICON_SIZE - ICON_MARGIN);
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

    for (let y = 0; y < height; y += bg_img.height) {
      for (let x = 0; x < width; x += bg_img.width) {
        p.image(bg_img, x, y);
      }
    }

    for (var k = 0; k < NUM_ICONS; k++) {
      p.image(icons[k], xCoords[k], yCoords[k]);
      p.fill(DARK_COLOR);
      if (k == selectedIconIdx) {
        var box = font.textBounds(ICON_STRINGS[k],
                                  xCoords[k] + ICON_SIZE/2,
                                  yCoords[k] + ICON_SIZE + TEXT_OFFSET,
                                  FONT_SIZE);
        p.fill(DARK_COLOR);
        p.rect(box.x - SELECTION_MARGIN - 1,
               box.y - SELECTION_MARGIN,
               box.w + 2 * SELECTION_MARGIN,
               box.h + 2 * SELECTION_MARGIN);
        p.fill(LIGHT_COLOR);
      }
      p.text(ICON_STRINGS[k],
             xCoords[k] + ICON_SIZE/2,
             yCoords[k] + ICON_SIZE + TEXT_OFFSET);
    }
  };

  p.windowResized = function () {
    width = parseInt(url.searchParams.get('width'));
    height = parseInt(url.searchParams.get('height'));
    width = width || p.windowWidth;
    height = height || p.windowHeight;
    p.resizeCanvas(width, height);
    p.loop();
  };
}
