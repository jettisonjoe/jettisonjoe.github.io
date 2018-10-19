/**
* A dashboard showing recent donations in a Scrato-scraped campaign.
* @param {string} campaignName Name of the campaign.
* @param {number} x            The x position for the left edge of the dash.
* @param {number} y            The y position for the top edge of the dash.
* @param {string} color        Color string in 'rgb()' notation for text color.
**/
class ScratoDash {
  static get FONT_SIZE() { return 22; }
  static get LINE_SPACING() { return 1.25; }

  /**
  * Initialize the dashboard class by preloading variuos resources.
  * @param {object} p An object that implements p5.js's API.
  */
  static preload(p) {
    ScratoDash.FONT = p.loadFont('assets/fonts/gohufont-uni-11.ttf');
    ScratoDash.DEFAULT_TEXT_COLOR = p.color(255, 255, 255);
  }

  constructor(p, campaignName, x, y) {
    this._campaign = new ScratoCampaign(campaignName, 3000);
    this._campaign.update(p);
    this._pos = p.createVector(x, y);
    this._textColor = p.color(ScratoDash.DEFAULT_TEXT_COLOR);
  }

  /**
  * Update and draw this dashboard.
  * @param {object} p An object that implements p5.js's API.
  */
  draw(p) {
    this._campaign.update(p);

    p.noStroke();
    p.fill(this._textColor);
    p.textAlign(p.LEFT, p.TOP);
    p.textFont(ScratoDash.FONT);

    let lineY = this._pos.y;

    p.textSize(ScratoDash.FONT_SIZE);
    p.text('Campaign data for ' + this._campaign.campaignName,
           this._pos.x, lineY);
    lineY += ScratoDash.LINE_SPACING * ScratoDash.FONT_SIZE;

    if (!this._campaign.donors) { return; }

    p.text('  Goal: $' + this._campaign.goal.toFixed(2),
           this._pos.x, lineY);
    lineY += ScratoDash.LINE_SPACING * ScratoDash.FONT_SIZE;

    p.text('  Raised: $' + this._campaign.raised.toFixed(2),
           this._pos.x, lineY);
    lineY += ScratoDash.LINE_SPACING * ScratoDash.FONT_SIZE;

    p.text('  Recent donations:', this._pos.x, lineY);
    lineY += ScratoDash.LINE_SPACING * ScratoDash.FONT_SIZE;

    for (var i = 0; i < this._campaign.donors.length; i++) {
      let [name, amount] = this._campaign.donors[i];
      p.text('    ' + name + '  ' + amount, this._pos.x, lineY);
      lineY += ScratoDash.LINE_SPACING * ScratoDash.FONT_SIZE;
    }
  }
}


var sketch = function (p) {
  var campaignName,
      dash;

  p.preload = function () {
    ScratoDash.preload(p);
    campaignName = url.searchParams.get('campaign') || 'scrato';
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    dash = new ScratoDash(p, campaignName, 20, 20);
  };

  p.draw = function () {
    p.background(16);
    dash.draw(p);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
