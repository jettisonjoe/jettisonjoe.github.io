/**
*  A progress bar for Ben Haunty's Monster Marathon for Charity.
*  @param {number} goal     The goal amount for the progress bar.
*  @param {number} progress The current level of progress.
**/
class HauntyProgressBar {
  static get FONT_SIZE_LARGE() { return 50; }
  static get MAX_FONT_SMALL() { return 40; }
  static get FILL_RATE_PER_S() { return 0.05; }
  static get RED_COLOR_STRING() { return 'rgb(254,21,107)'; }
  static get WHITE_COLOR_STRING() { return 'rgb(255,255,226)'; }

  /**
  * Initialize the HauntyProgressBar class by preloading variuos resources.
  * @param {object} p An object that implements p5.js's API.
  */
  static preload(p) {
    HauntyProgressBar.FONT = p.loadFont(
        'assets/fonts/PermanentMarker-Regular.ttf');
  }

  constructor() {
    // super();
    this.goal = null;
    this._progress = 0;
    this._displayedProgress = null;
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
    // Draw the progress bar.
    p.rectMode(p.CORNER);
    p.fill(HauntyProgressBar.WHITE_COLOR_STRING);
    p.rect(20, 20, 300, 400);
    p.fill(HauntyProgressBar.RED_COLOR_STRING);
    var fillHeight = 400 * (this._displayedProgress / this.goal);
    var fillY = 20 + (400 - fillHeight);
    p.rect(20, fillY, 300, fillHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont(HauntyProgressBar.FONT);
    p.textSize(HauntyProgressBar.FONT_SIZE_LARGE);
    p.fill(HauntyProgressBar.WHITE_COLOR_STRING);
    p.text(
        '$' + Math.floor(this._displayedProgress).toFixed(0),
        170, 220);
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
    progressBar = new HauntyProgressBar();
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
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
