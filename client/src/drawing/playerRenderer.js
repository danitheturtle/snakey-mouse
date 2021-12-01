import Victor from 'victor';
const Vector = Victor;
let s, spl, sg, sv;
export const init = (_state) => {
  s = _state;
  sg = s.game;
  spl = s.player;
  sv = s.view;
}
export class PlayerRenderer {
  constructor(_radius, _color) {
    this.radius = _radius;
    this.color = _color;
    this.parent = undefined;
  }
  draw() {
    if (!this.parent || !this.parent?.collider) return;
    const c = s.ctx;
    const snakeBodyRelativePositions = this.parent.collider.parts
      .map(partPos => sv.active?.getObjectRelativePosition(partPos, true));
    snakeBodyRelativePositions.forEach(pos => {
      c.save();
      c.fillStyle = this.color || 'red';
      c.beginPath();
      c.arc(pos.x, pos.y, this.radius * sg.gu, 0, 2*Math.PI);
      c.fill()
      c.restore();
    })
  }
  getData() {
    return {
      radius: this.radius,
      color: this.color
    };
  }
  setData(_data, _parent) {
    this.radius = _data.radius;
    this.parent = _parent;
    this.color = _data.color || _parent.color;
  }
}