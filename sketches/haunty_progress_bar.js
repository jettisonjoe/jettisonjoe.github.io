/**
*  A progress bar for Ben Haunty's Monster Marathon for Charity.
*  @param {number} goal     The goal amount for the progress bar.
*  @param {number} progress The current level of progress.
**/
class HauntyProgressBar {
  static get FONT_SIZE_LARGE() { return 60; }
  static get MAX_FONT_SMALL() { return 50; }

  /**
  * Initialize the HauntyProgressBar class by preloading variuos resources.
  * @param {object} p An object that implements p5.js's API.
  */
  static preload(p) {
    // HauntyProgressBar.IMAGE = p.loadImage('');
    // HauntyProgressBar.FONT = p.loadFont(
    //     'assets/fonts/Outrun future Bold.otf');
    // HauntyProgressBar.RED_COLOR_STRING = 'rgb(254,21,107)';
  }

  constructor() {
    // super();
    this.goal = null;
    this._progress = 0;
    this._displayedProgress = 0;
  }

  set progress(amount) {
    if (amount && this._progress < amount) {
      this._progress = amount;
    }
    if (this._displayedProgress == 0) {
      // The first time progress is really set, don't animate; just initialize.
      this._displayedProgress = this._progress;
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
    if (this.goal == null) { return; }
    if (this._displayedProgress < this._progress) {
      // Add some amount to displayedProgress.
    }
    // Draw the progress bar.
  }
}


var sketch = function (p) {
  var previousTotal = null;
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
    if (campaign.lastUpdate && previousTotal == null) {
      progressBar.progress = campaign.raised;
        // First time reading actual data will set previousTotal non-null.
        previousTotal = campaign.raised;
    } else if (campaign.raised && campaign.raised > previousTotal) {
      var delta = campaign.raised - previousTotal;
      var idx = 0;
      while (delta > 0 && idx < campaign.donors.length) {
        let [name, amount] = campaign.donors[idx];
        alertQueue.enqueue(new HauntyAlert(name, amount));
        delta = delta - amount;
        idx++;
      }
      previousTotal = campaign.raised;
    }

    alertQueue.update(p);

    // DEBUG
    if (p.frameCount == 2) {
      alertQueue.enqueue(new HauntyAlert('Griggle Merph', 100.0));
      alertQueue.enqueue(
          new HauntyAlert('Jettison Joe The Amazing Bald Eagle', 5.5));
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
