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
    this.lastUpdate = null;
    this._state = null;
    this._rateLimitMs = rateLimitMs;
    this._inProgress = false;
  }

  get goal() { return this._state && this._state['goal']; }
  get raised() { return this._state && this._state['raised']; }
  get donors() { return this._state && this._state['donors']; }

  /**
  * Returns true iff making a request now would exceed our rate limit.
  */
  _rateLimited() {
    return (this.lastUpdate != null
            && Date.now() <= this.lastUpdate + this._rateLimitMs);
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
          this.lastUpdate = Date.now();
        }.bind(this));
  }
}


/**
* Campaign data for one fundraiser campaign server by the Tiltify API.
* @param {string} campaignId ID of the campaign to track.
* @param {number} rateLimitMs  Minimum milliseconds between requests to server.
* @param {string} token Tiltify API Application Access Token.
*/
class TiltifyCampaign {
  static get BASE_URL() { return 'https://tiltify.com/api/v3/campaigns/'; }

  constructor(campaignId, rateLimitMs, token) {
    this.url = TiltifyCampaign.BASE_URL + campaignId;
    this.lastUpdate = null;
    this._state = null;
    this._rateLimitMs = rateLimitMs;
    this._auth = 'Bearer ' + token;
    this._inProgress = false;
  }

  get goal() { return this._state && this._state.fundraiserGoalAmount; }
  get raised() { return this._state && this._state.amountRaised; }

  /**
  * Returns true iff making a request now would exceed our rate limit.
  */
  _rateLimited() {
    return (this.lastUpdate != null
            && Date.now() <= this.lastUpdate + this._rateLimitMs);
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
    p.httpDo(
        this.url,
        {
          method: 'GET',
          headers: { authorization: this._auth }
        },
        function(response) {
          let response_obj = JSON.parse(response);
          if (response_obj.meta.status != 200) { return; }
          this._state = response_obj.data;
          this._inProgress = false;
          this.lastUpdate = Date.now();
        }.bind(this));
  }
}

/**
* Milestone data for one fundraiser campaign server by the Tiltify API.
*
* Note: The Tiltify API v3 apparently got rid of milestones, so we simulate
* them here by duplicating each milestone as an inactive "challenge" instead.
*
* @param {string} campaignId ID of the campaign to track.
* @param {number} rateLimitMs  Minimum milliseconds between requests to server.
* @param {string} token Tiltify API Application Access Token.
*/
class TiltifyMilestones {
  static get BASE_URL() { return 'https://tiltify.com/api/v3/campaigns/'; }

  constructor(campaignId, rateLimitMs, token) {
    this.campaignUrl = TiltifyCampaign.BASE_URL + campaignId;
    this.milestoneUrl = TiltifyCampaign.BASE_URL + campaignId + '/challenges';
    this.lastUpdate = null;
    this._next = null;
    this._rateLimitMs = rateLimitMs;
    this._auth = 'Bearer ' + token;
    this._milestones = null;
    this._inProgress = false;
  }

  get nextMilestone() { return this._milestones && this._next; }

  /**
  * Returns true iff making a request now would exceed our rate limit.
  */
  _rateLimited() {
    return (this.lastUpdate != null
            && Date.now() <= this.lastUpdate + this._rateLimitMs);
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
    p.httpDo(
        this.milestoneUrl,
        {
          method: 'GET',
          headers: { authorization: this._auth }
        },
        function(milestone_response) {
          this._milestones = JSON.parse(milestone_response);
          if (this._milestones.meta.status != 200) { return; }
          p.httpDo(
              this.campaignUrl,
              {
                method: 'GET',
                headers: { authorization: this._auth }
              },
              function(campaign_response) {
                let campaign_obj = JSON.parse(campaign_response);
                if (campaign_obj.meta.status != 200) { return; }
                let candidate = this._milestones.data[0];
                for (let i = 1; i < this._milestones.data.length; i++) {
                  let amt = this._milestones.data[i].amount;
                  if (amt > campaign_obj.data.amountRaised &&
                      amt < candidate.amount) {
                    candidate = this._milestones.data[i];
                  }
                }
                this._next = candidate;
                this._inProgress = false;
                this.lastUpdate = Date.now();
              }.bind(this));
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

  draw(p) {
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
      this._nowPlaying.draw(p);
    } else if (this.queue.length > 0) {
      this._nowPlaying = this.queue.shift();
    }
  }
}
