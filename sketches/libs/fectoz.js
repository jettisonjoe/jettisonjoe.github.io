class Starfield {
  static get MAX_STARS_PER_PX() { return 1; }
  static get MAX_ROT_SPEED() { return 1; }

  constructor(p, x, y, r, density, starSize, rotSpeed) {
    this.pos = p.createVector(x, y);
    this._stars = [];
    this._rotation = 0;
    this._rotSpeed = rotSpeed * Starfield.MAX_ROT_SPEED;

    p.angleMode(p.RADIANS);
    var numStars = Math.PI * radius^2 * density * Starfield.MAX_STARS_PER_PX;
    for (var i = 0; i < numStars; i++) {
      var newStar = p.createVector();
      newStar.setMag(p.random(radius));
      newStar.rotate(p.random(2 * Math.PI));
      this._stars.push(newStar);
    }
  }

  draw(p) {
    p.push();
    this._rotation -= this._rotSpeed;
    p.rotate(this._rotation);
    p.translate(this.pos.x, this.pos.y);
    p.stroke(255);
    for (var i = 0; i < this._stars.length; i++) {
      p.strokeWeight(this._stars[i].z + p.random() - 0.5);
      p.point(this._stars[i].x, this.stars[i].y);
    }
    p.pop();
  }
}
