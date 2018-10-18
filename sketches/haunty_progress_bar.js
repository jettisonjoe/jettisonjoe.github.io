class Bubble {
  static get SCALAR() { return 1/12000; }
  static get SPEED() { return 1.2; }

  static preload(p) {
    Bubble.OUTER_FILL = p.color(255, 255, 255, 90);
    Bubble.INNER_FILL = p.color(254, 21, 107);
  }

  constructor(p, x, y, k) {
    this.pos = p.createVector(x, y);
    this.popped = false;
    this._left = 0;
    this._right = 0;
    this._top = 0;
    this._bot = 0;
    this._k = k;
    this._t = 0;
    this._innerR = 0;
    this._outerR = 0;
    this._offset = p.createVector(1, 1);
    this._offset.heading(p.random(0, 2*Math.PI));
  }

  setBounds(x1, x2, y1, y2) {
    this._left = x1;
    this._right = x2;
    this._top = y1;
    this._bot = y2;
  }

  isInBounds() {
    var buffer = this._outerR * Bubble.SCALAR * this._k;
    return (
        this.pos.x > this._left + buffer
        && this.pos.x < this._right - buffer
        && this.pos.y > this._top + buffer
        && this.pos.y < this._bot - buffer);
  }

  draw(p) {
    // move
    this.pos.x += p.random([-1, 1]);
    this.pos.y -= Bubble.SPEED;

    // expand
    this._t++;
    this._innerR = (this._t * this._t);
    this._outerR = (this._t * 100);

    // maybe pop
    if (this._innerR >= this._outerR || !this.isInBounds()) {
      this.popped = true;
      return;
    }

    // maybe render
    this._offset.rotate(p.random(-0.2, 0.2));
    this._offset.setMag(
        (this._outerR - this._innerR) * Bubble.SCALAR * this._k);
    p.ellipseMode(p.RADIUS);
    p.noStroke();
    p.fill(Bubble.OUTER_FILL);
    p.ellipse(this.pos.x, this.pos.y,
              this._outerR * Bubble.SCALAR * this._k,
              this._outerR * Bubble.SCALAR * this._k);
    p.fill(Bubble.INNER_FILL);
    p.ellipse(this.pos.x + this._offset.x, this.pos.y + this._offset.y,
              this._innerR * Bubble.SCALAR * this._k,
              this._innerR * Bubble.SCALAR * this._k);
  }
}

class BubbleSystem {
  constructor(p, x, y, w, h, r, n) {
    this.pos = p.createVector(x, y);
    this.size = p.createVector(w, h);
    this._r = r;
    this._n = n;
    this._bubbles = new Array(n);
    for (var i = 0; i < this._n; i++) {
      this._bubbles[i] = this._makeNewBubble(p);
    }
  }

  draw(p) {
    // if (p.frameCount > 200) { debugger; }
    for (var i = 0; i < this._n; i++) {
      if (this._bubbles[i].popped) {
          this._bubbles[i] = this._makeNewBubble(p);
      }
      this._bubbles[i].setBounds(this.pos.x, this.pos.x + this.size.x,
                                 this.pos.y, this.pos.y + this.size.y);
      this._bubbles[i].draw(p);
    }
  }

  _makeNewBubble(p) {
    return new Bubble(
        p,
        p.random(this.pos.x, this.pos.x + this.size.x),
        p.random(this.pos.y, this.pos.y + this.size.y),
        this._n);
  }
}


/**
*  A progress bar for Ben Haunty's Monster Marathon for Charity.
*  @param {number} goal     The goal amount for the progress bar.
*  @param {number} progress The current level of progress.
**/
class HauntyProgressBar {
  static get FONT_SIZE_LARGE() { return 50; }
  static get FONT_SIZE_SMALL() { return 24; }
  static get FILL_RATE_PER_S() { return 0.05; }
  static get RED_COLOR_STRING() { return 'rgb(254,21,107)'; }
  static get WHITE_COLOR_STRING() { return 'rgb(255,255,226)'; }

  /**
  * Initialize the HauntyProgressBar class by preloading variuos resources.
  * @param {object} p An object that implements p5.js's API.
  */
  static preload(p) {
    HauntyProgressBar.JAR = p.loadImage('assets/img/haunty_jar.png');
    HauntyProgressBar.JAR_BG = p.loadImage('assets/img/haunty_jar_bg.png');
    HauntyProgressBar.FONT = p.loadFont(
        'assets/fonts/PermanentMarker-Regular.ttf');
    Bubble.preload(p);
  }

  constructor(p, x, y) {
    // super();
    this.pos = p.createVector(x, y);
    this.fluidPos = p.createVector(x + 16, y + 72);
    this.size = p.createVector(275, 297);
    this.goal = null;
    this._progress = 0;
    this._displayedProgress = null;
    this._bubbles = new BubbleSystem(
        p, this.pos.x, this.pos.y, this.size.x, this.size.y, 1.5, 12);
  }

  set progress(amount) {
    if (amount && this._progress < amount) {
      this._progress = amount;
      if (this._displayedProgress == null) {
        // The first time progress is really set, don't animate.
        this._displayedProgress = this._progress;
      }
    }
  }

  get progress() {
    return this._progress;
  }

  /**
  * Update and draw this progress bar.
  * @param {object} p An object that implements p5.js's API.
  */
  draw(p) {
    // Cannot compute any of the geometry without a goal amount.
    if (this.goal == null || this._displayedProgress == null) { return; }
    if (this._displayedProgress < this._progress) {
      var fractionToFill = HauntyProgressBar.FILL_RATE_PER_S / p.frameRate();
      this._displayedProgress = p.min(
          this._displayedProgress + (fractionToFill * this.goal),
          this.goal);
    }

    p.image(HauntyProgressBar.JAR_BG, this.pos.x, this.pos.y);

    // Draw the progress bar.
    p.noStroke();
    p.fill(HauntyProgressBar.RED_COLOR_STRING);
    var fillHeight = this.size.y * (this._displayedProgress / this.goal);
    var fillY = this.fluidPos.y + (this.size.y - fillHeight);
    p.rect(this.fluidPos.x, fillY, this.size.x, fillHeight);

    this._bubbles.pos = p.createVector(this.fluidPos.x, fillY);
    this._bubbles.size = p.createVector(this.size.x, fillHeight);
    this._bubbles.draw(p);

    p.image(HauntyProgressBar.JAR, this.pos.x, this.pos.y);

    p.textAlign(p.CENTER, p.CENTER);
    p.textFont(HauntyProgressBar.FONT);
    p.textSize(HauntyProgressBar.FONT_SIZE_LARGE);
    p.fill(0);
    p.stroke(255)
    p.text(
        '$' + Math.floor(this._displayedProgress).toFixed(0),
        this.pos.x + 130, this.pos.y + 195);
    p.textSize(HauntyProgressBar.FONT_SIZE_SMALL);
    p.text('/ ' + Math.floor(this.goal).toFixed(0),
           this.pos.x + 210, this.pos.y + 248);
  }
}


var sketch = function (p) {
  var campaign,
      progressBar;

  p.preload = function () {
    HauntyProgressBar.preload(p);
    let campaignName = url.searchParams.get('campaign') || 'scrato';
    campaign = new ScratoCampaign(campaignName, 6000);
    campaign.update(p); // Initial update.
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    progressBar = new HauntyProgressBar(p, 10, 10);
    p.rectMode(p.CORNER);
  };

  p.draw = function () {
    // p.clear();
    p.background(127);

    campaign.update(p);
    if (progressBar.goal == null) {
      progressBar.goal = campaign.goal;
    }
    progressBar.progress = campaign.raised;
    progressBar.draw(p);

    // DEBUG
    if (p.frameCount == 100) {
      progressBar.progress = progressBar.progress + 100;
      progressBar.progress = progressBar.progress + 300;
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
