// Converted for p5.js Web Embed in Spatial
let nodes = [];
let colors = [
  "#0a0d02BB", "#922301BB", "#f76e0BB9", "#ead8b8BB", "#c0df80BB",
  "#a59b3cBB", "#86601aBB", "#013f61BB", "#07606aBB", "#0f7b9cBB",
  "#366a1cBB", "#eb7300BB", "#142027BB", "#47020eBB", "#884114BB",
  "#686963BB", "#66aecBB9", "#8ab2c0BB", "#2f3b3eBB", "#dd841f",
  "#0f202e", "#862534", "#116887", "#304fad", "#451c06",
  "#743212", "#9c400a", "#f97e01", "#929e78", "#13b2bc",
  "#0c8194", "#0c8194"
];

let mode = 0;
let i = 0;
let moving = true;
let rseed;
let zoom = 1;
let tzoom = 1;
let freq = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rseed = random(1000);
}

function draw() {
  randomSeed(rseed);

  if (frameCount % 5 === 0 && i < colors.length) {
    let ang = map(i, 0, colors.length, 0, TAU) - HALF_PI;
    nodes.push(new Node(i % 2, i, ang));
    i++;
  }

  background(255);
  translate(width / 2, height / 2);

  zoom = lerp(zoom, tzoom, 0.1);
  push();
  scale(zoom);

  for (let n of nodes) {
    n.show();
    n.connect();
    n.arrange();
  }

  pop();
}

function mousePressed() {
  mode = (mode + 1) % 5;
  if (mode == 0) freq++;
  if (freq == 7) freq = 1;

  rseed = random(1000);
  frameCount = 0;
}

function keyPressed() {
  if (keyCode !== 32) return;
  moving = !moving;

  for (let n of nodes) {
    if (!moving) {
      n.counter = HALF_PI;
    } else {
      n.counter = map(n.i, 0, colors.length - 1, 0, TAU) - HALF_PI;
    }
  }
}

function mouseWheel(event) {
  tzoom += event.delta / 1000;
  tzoom = constrain(tzoom, 1, 2);
}

class Node {
  constructor(side, i, ang) {
    this.side = side;
    this.i = i;
    this.ang = ang;
    this.counter = ang;
    this.pos = createVector();
  }

  arrange() {
    let r = map(freq, 1, 6, width * 0.15, width * 0.45);
    let spin = moving ? frameCount * 0.002 : 0;

    this.pos.x = cos(this.counter + spin) * r;
    this.pos.y = sin(this.counter + spin) * r;
  }

  show() {
    fill(colors[this.i]);
    noStroke();
    ellipse(this.pos.x, this.pos.y, width * 0.03);
  }

  connect() {
    for (let other of nodes) {
      if (other === this) continue;

      let inter = lerpColor(
        color(colors[this.i]),
        color(colors[other.i]),
        0.5
      );

      stroke(inter);
      strokeWeight(1);

      line(
        this.pos.x, this.pos.y,
        other.pos.x, other.pos.y
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
