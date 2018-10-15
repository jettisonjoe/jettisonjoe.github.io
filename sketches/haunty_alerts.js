/** TODOS
*  - Make a progress bar that looks nice.
*  - Find a better font and visual style for the raised/goal text.
*  - Test live alerts with an actual donation or two.
*  - Pass in campaign name as a URL parameter.
**/

class HauntyAlert extends StreamAlert {
  static get FONT_SIZE() { return 80; }
  static get MAX_FONT_SIZE() { return 800; }
  static get MIN_FONT_SIZE() { return 20; }

  static get T_HOLD() { return 1000; }
  static get T_FADE_OUT() { return 2450; }
  static get T_COMPLETE() { return 2800; }

  static preload(p) {
    HauntyAlert.SOUND = p.loadSound('assets/sounds/werewolf.mp3');
    HauntyAlert.FONT = p.loadFont('assets/fonts/PermanentMarker-Regular.ttf');
    HauntyAlert.RED_COLOR_STRING = 'rgb(254,21,107)';
    HauntyAlert.WHITE_COLOR_STRING = 'rgb(255,255,226)';
    HauntyAlert.BLUE_COLOR_STRING = 'rgb(0,176,255)';
  }

  constructor(donorName, amount) {
    super();
    this.donorName = donorName;
    this.amount = Math.floor(amount).toFixed(0);
    this._sound = HauntyAlert.SOUND;
    this._textAlpha = null;
    this._textSize = HauntyAlert.FONT_SIZE;
    this._red = null;
    this._white = null;
    this._blue = null;
  }

  update(p) {
    if (this.isComplete) { return; }
    if (this._t == 0) {
      // First frame of the alert.
      this._red = p.color(HauntyAlert.RED_COLOR_STRING);
      this._white = p.color(HauntyAlert.WHITE_COLOR_STRING);
      this._blue = p.color(HauntyAlert.BLUE_COLOR_STRING);
      this._textAlpha = 0;
      this._sound.play();
    }
    if (this._t < HauntyAlert.T_HOLD) {
      // Fade-in period.
      this._textSize = p.map(
          this._t,
          0, HauntyAlert.T_HOLD,
          HauntyAlert.MAX_FONT_SIZE, HauntyAlert.FONT_SIZE);
      this._textAlpha = p.map(
          this._t,
          0, HauntyAlert.T_HOLD,
          0, 255);
    } else if (this._t < HauntyAlert.T_FADE_OUT) {
      // Hold period.
      this._textSize = HauntyAlert.FONT_SIZE;
      this._textAlpha = 255;
    } else if (this._t < HauntyAlert.T_COMPLETE) {
      // Fade-out period.
      this._textSize = p.map(
          this._t,
          HauntyAlert.T_FADE_OUT, HauntyAlert.T_COMPLETE,
          HauntyAlert.FONT_SIZE, HauntyAlert.MIN_FONT_SIZE);
      this._textAlpha = p.map(
          this._t,
          HauntyAlert.T_FADE_OUT, HauntyAlert.T_COMPLETE,
          255, 0);
    } else {
      // Complete.
      this._textAlpha = 0;
      this._sound.stop();
    }
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont(HauntyAlert.FONT);
    p.textSize(this._textSize);
    this._red.setAlpha(this._textAlpha);
    p.fill(this._red);
    p.text(
        this.donorName + '\n$' + this.amount,
        p.windowWidth/2 + this._textSize / 20,
        p.windowHeight/2 + this._textSize / 20);
    this._white.setAlpha(this._textAlpha);
    p.fill(this._white);
    p.text(
        this.donorName + '\n$' + this.amount,
        p.windowWidth/2,
        p.windowHeight/2);
    super.update(p);
  }
}


var sketch = function (p) {
  var previousTotal = null;

  p.preload = function () {
    HauntyAlert.preload(p);
    campaign = new ScratoCampaign('krista-and-luis', 6000);
    campaign.update(p); // Initial update.
    alertQueue = new StreamAlertQueue();
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    // p.clear();
    p.background(127);

    campaign.update(p);
    if (previousTotal == null) {
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
      alertQueue.enqueue(new HauntyAlert('Griggle', 100.0));
      alertQueue.enqueue(new HauntyAlert('Merph', 200.5));
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
