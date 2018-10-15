/**
 * Campaign data for one fundraiser campaign served by Scrato.
 * @param {string} campaignName Name of the campaign to track.
 * @param {number} rateLimitMs  Minimum milliseconds between requests to server.
 */
class ScratoCampaign {
  static get BASE_URL() { return 'http://scrato.jettisonjoe.com/campaign/'; }

  constructor(campaignName, rateLimitMs) {
    this.campaignName = campaignName;
    this.url = ScratoCampaign.BASE_URL + campaignName;
    this._state = null;
    this._rateLimitMs = rateLimitMs;
    this._inProgress = false;
    this._lastUpdate = null;
  }

  get goal() { return this._state && this._state['goal']; }
  get raised() { return this._state && this._state['raised']; }
  get donors() { return this._state && this._state['donors']; }

  /**
  * Returns true iff making a request now would exceed our rate limit.
  */
  _rateLimited() {
    return (this._lastUpdate != null
            && Date.now() <= this._lastUpdate + this._rateLimitMs);
  }

  /**
  * Kick off a request to the server for fresh data unless rate limited.
  * @param {object} p An object that implements p5.js's API.
  */
  update(p) {
    // If there's already an update in progress or if we're rate limited, this
    // update is a no-op; return without doing anything.
    if (this._inProgress || this._rateLimited()) {
      return;
    }
    this._inProgress = true;
    p.httpGet(
        this.url,
        'json',
        false,
        function(response) {
          this._state = response;
          this._inProgress = false;
          this._lastUpdate = Date.now();
        }.bind(this));
  }
}


/**
 * Base class for stream alerts for use with StreamAlertQueue below.
 */
class StreamAlert {
  static get T_COMPLETE() { return 250; }

  constructor() {
    this.isComplete = false;
    this._t = 0;
  }

  update(p) {
    if (this._t >= this.constructor.T_COMPLETE) {
      this.isComplete = true;
    }
    this._t += 1000.0 / p.frameRate();
  }
}


/**
 * A FIFO queue of StreamAlert objects to play (through p5.js) one by one.
 * @param maxLength The maximum number of StreamAlert objects to queue.
 */
class StreamAlertQueue {
  constructor(maxLength) {
    this.maxLength = maxLength || 60;
    this.queue = [];
    this._nowPlaying = null;  // The stream alert that's playing now if any.
  }

  /**
   * Add a StreamAlert object to the play queue.
   */
  enqueue(streamAlert) {
    if (this.queue.length >= this.maxLength) {
      console.log(
          'Stream alert queue is full! Ignoring new alert: ' + streamAlert);
      return;
    }
    this.queue.push(streamAlert);
  }

 /**
  * Continue playing the current alert, or start the next one if available.
  * @param {object} p An object that implements p5.js's API.
  */
  update(p) {
    if (this._nowPlaying && !this._nowPlaying.isComplete) {
      this._nowPlaying.update(p);
    } else if (this.queue.length > 0) {
      this._nowPlaying = this.queue.shift();
    }
  }
}
