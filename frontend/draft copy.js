/*
 * @Author: Sunnary2604 50614684+Sunnary2604@users.noreply.github.com
 * @Date: 2023-11-20 21:33:02
 * @LastEditors: Sunnary2604 50614684+Sunnary2604@users.noreply.github.com
 * @LastEditTime: 2023-11-20 22:12:06
 * @FilePath: \As-Above-So-Below\frontend\draft.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// window height and width
let w = window.innerWidth;
let h = window.innerHeight;
let font;
let fontsize = 200;
let images = [];
let textValue = "MONEY";
let scale = 1;
let margin;
let recursive_level = 1;
let rainbow;
let cols, rows;
let pixelData;
let t = 4;
let drawMode = 0;
let position = {
  x: 0,
  y: 0,
};
function preload() {}

function setup() {
  rainbow = [
    color(255, 0, 0),
    color(255, 127, 0),
    color(255, 255, 0),
    color(0, 255, 0),
    color(0, 0, 255),
    color(75, 0, 130),
    color(148, 0, 211),
  ];
  margin = min(w, h) / 5;
  createCanvas(w, h);
  background(233, 214, 156);
  cols = width;
  rows = height;
}
function draw() {
  background(233, 214, 156);
  t += 0.01;
  if (t > 5) {
    t = 1;
    drawMode = 0;
  }
  // if click the left mouse, draw the recursive circle
  if (drawMode == 0) {
    drawMode = 1;
    position.x = random(width);
    position.y = random(height);
  }
  if (drawMode == 1) {
    recursiveCircle(position.x, position.y, 200 + t * 20, 100, recursive_level);
    noLoop();
  }
}

function recursiveCircle(x, y, size, opecity, recursive_level) {
  if (recursive_level < t) {
    push();

    translate(x, y);
    noFill();
    stroke(color(255, 255, 255, opecity - (t - recursive_level) * 70));

    let angle = [15, 30, 60, 90, 120];
    // line from center to edge of the circle
    let gap = 12 - recursive_level * 2;

    for (let i = 0; i < 360; i += angle[recursive_level]) {
      let x2 = (size / 2) * cos(radians(i));
      let y2 = (size / 2) * sin(radians(i));
      push();
      translate(x2, y2);
      recursiveCircle(0, 0, size / 2, opecity, recursive_level + 1);
      pop();

      for (let j = i - gap * 2; j <= i + gap * 2; j += gap) {
        let x1 = 0;
        let y1 = 0;
        x2 = (size / 2) * (t - recursive_level) * cos(radians(j));
        y2 = (size / 2) * (t - recursive_level) * sin(radians(j));

        strokeWeight(1);

        line(x1, y1, x2, y2);
      }
    }

    pop();
  }
}
function mousePressed() {
  loop();
}
