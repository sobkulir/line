let CANVAS = null;
const CANVAS_ID = "main-canvas";

console.log("Controls: Arrow keys + 'D' and 'F'")
let P_ZOOM = 0.8;
let P_LINE_SPACING = 0.1;
let P_LINE_COUNT = 150;
let P_LINE_NOISE = 0.15;

let c_WIDTH_PX = 800;

class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }

  midPoint(other) {
    return new Point((this.x + other.x) / 2, (this.y + other.y) / 2);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  mul(scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  }
}

function setup() {
    const el = document.getElementById(CANVAS_ID);
    CANVAS = createCanvas(el.clientWidth, el.clientHeight);
    CANVAS.parent(CANVAS_ID);
    background(255);
    c_WIDTH_PX = Math.floor(0.618 * width)
}

const polygonVertices = (x, y, radius, npoints) => {
  const angle = TWO_PI / npoints;
  const ret = []
  for (let i = 0; i < npoints; i++) {
    const x_new = x + cos(angle * i) * radius;
    const y_new = y + sin(angle * i) * radius;
    ret.push(new Point(x_new, y_new));
  }
  return ret;
}

const scramble = (vertices) => {
  const ret = [];
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    ret.push(vertices[i]);
    const mid = vertices[i].midPoint(vertices[(i + 1) % n]);
    const noiseFunc = (id) => 300 * (noise(frameCount / 200, id) - 0.5);
    let noiseRaw = new Point(noiseFunc(20*i), noiseFunc(20*i+10));
    ret.push(mid.add(noiseRaw));
  }
  return ret;
}

function draw() {
  clear();
  const vertices = polygonVertices(width / 2, height / 2, 200, 6);
  const scrambled = scramble(vertices);
  stroke(0, Math.min(255, 80 + 7*P_LINE_SPACING))
  for (let i = 0; i < P_LINE_COUNT; i++) {
    perlinNoiseDensity(i, height/2 - (P_LINE_SPACING * P_LINE_COUNT/2) + i * P_LINE_SPACING);
  }
  if (keyIsDown(LEFT_ARROW)) {
    P_ZOOM = Math.max(0.01, P_ZOOM - 0.1);
  } 
  if (keyIsDown(RIGHT_ARROW)) {
    P_ZOOM = Math.min(100, P_ZOOM + 0.1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    P_LINE_SPACING = Math.max(0.1, P_LINE_SPACING - 0.1);
  } 
  if (keyIsDown(UP_ARROW)) {
    P_LINE_SPACING = Math.min(100, P_LINE_SPACING + 0.1);
  }
  if (keyIsDown(68)) {
    P_LINE_NOISE = Math.max(0, P_LINE_NOISE - 0.04);
  }
  if (keyIsDown(70)) {
    P_LINE_NOISE = Math.min(12, P_LINE_NOISE + 0.04);
  }
}

const perlinNoiseDensity = (lineIdx, y) => {
  noFill();
  beginShape();
  const n = c_WIDTH_PX + Math.floor(10*(noise(frameCount / 400 + lineIdx/50) - 0.5));
  for (let i = 0; i < n; i++) {
    vertex(i, y + 200 *  (noise(P_LINE_NOISE * (lineIdx /P_LINE_COUNT) - P_LINE_NOISE / 2, i * P_ZOOM / c_WIDTH_PX - P_ZOOM + frameCount / 200) - 0.5));
  }
  endShape();


}
