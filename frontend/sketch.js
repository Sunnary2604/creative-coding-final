// window height and width
let w = window.innerWidth;
let h = window.innerHeight;
let font;
let color = {
  handDrawnCircle: [0, 0, 0, 255],
};
let fontsize = 200
;
let images = [];
let textValue = "MONEY";
let scale = 1;
function preload() {
  font = loadFont("./assets/font/EraserRegular.ttf");
  // load all images under the folder ./assets/image/, 2-1 to 2-4
  let imagePaths = "./assets/image/";
  for (let i = 1; i <= 4; i++) {
    let imagePath = imagePaths + "2-" + i + ".png";
    images.push(loadImage(imagePath));
  }
}

function setup() {
  createCanvas(w, h);
  inputBox = createInput();
  inputBox.position(20, 20);
  inputBox.size(200, 20);
  inputBox.value(textValue);

  handDrawnText();
  textValue = inputBox.value(); // Get the current value of the input box

  // // circle with same center, different radius
  // for (let i = 0; i < 10; i++) {
  //   let radius = i * 50;
  //   handDrawnCircle(radius, width / 2, height / 2, color.handDrawnCircle);
  // }
  papyrusBackground();

  stylizeText(textValue, 200, 500, 0.01, scale);
}

function draw() {}
/**
 * papyrusBackground
 */
function papyrusBackground() {
  background(233, 214, 156);
  // circle
  // for (let i = 0; i < width * height * 0.1; i++) {
  //   let x = random(width);
  //   let y = random(height);
  //   let r = random(1, 5);
  //   noStroke();
  //   fill(207, 182, 112, random(50, 150));
  //   ellipse(x, y, r, r);
  // }

  // lines
  for (let i = 0; i < height; i += 4) {
    stroke(207, 182, 112, 50);
    strokeWeight(1);
    line(0, i, width, i);
  }
}

/**
 * hand drawn text
 */
function handDrawnText() {
  textFont(font);
  textSize(60);
  fill(0);
}

/**
 * hand drawn circle
 */
function handDrawnCircle(radius, x, y, color) {
  push(); // Save the current drawing settings
  stroke(color);
  noFill();
  strokeWeight(3);
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.01) {
    let offset = noise(angle * 50, frameCount * 0.01) * 5; // Graininess effect
    let r = radius + offset; // Radius with noise
    let xCircle = x + r * cos(angle);
    let yCircle = y + r * sin(angle);
    vertex(xCircle, yCircle);
  }
  endShape(CLOSE);
  pop();
}

function stylizeText(word, x, y, noiseFactor, scale) {
  // textSize(fontsize);
  // text(word, x, y);
  let points_base = font.textToPoints(word, x, y, fontsize, {
    sampleFactor: 0.08,
    simplifyThreshold: 0,
  });
  let points_decoration = font.textToPoints(word, x, y, fontsize, {
    sampleFactor: 0.01,
    simplifyThreshold: 0,
  });
  for (let i = 0; i < points_base.length; i++) {
    let pt = points_base[i];
    let noiseX = noise(pt.x * noiseFactor) * 5; // Adjust the noise level for x-coordinate
    let noiseY = noise(pt.y * noiseFactor) * 5; // Adjust the noise level for y-coordinate
    let size = 20 * scale;

    rotation = random(0, 360);
    push();
    translate(pt.x, pt.y);
    rotate(rotation);
    fill(241, 232, 212);
    stroke(0);
    strokeWeight(1);
    circle(noiseX, noiseY, size);
    // center the image
    imageMode(CENTER);
    image(images[0], noiseX, noiseY, size, size); // Adjust the size as needed
    pop();
  }

  for (let i = 0; i < points_decoration.length; i += 2) {
    let pt = points_decoration[i];
    let noiseX = noise(pt.x * noiseFactor) * 5; // Adjust the noise level for x-coordinate
    let noiseY = noise(pt.y * noiseFactor) * 5; // Adjust the noise level for y-coordinate
    let index = floor(random(0, images.length));
    let size = random(10, 40) * scale;
    rotation = random(0, 360);
    push();
    translate(pt.x, pt.y);
    rotate(rotation);
    imageMode(CENTER);
    if (index <= 1) {
      fill(232, 185, 98);
      stroke(0);
      strokeWeight(1);
      circle(noiseX, noiseY, size+2);
    }

    image(images[index], noiseX, noiseY, size, size); // Adjust the size as needed
    pop();
  }
}
