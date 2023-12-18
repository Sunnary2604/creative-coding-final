// Global variables for canvas dimensions, branching parameters, and color settings
let width = window.innerWidth,
  height = window.innerHeight;
let thetaVar = 10,
  theta = 20; // Branch angle variability
let startWidth = 10,
  startLength = 100; // Initial branch dimensions
let seed = 0; // Seed for random number generation
let noiseVar = 1; // Wind effect variability
let initial_color, final_color; // Colors for branch gradient
let wind = 0; // Wind effect on branches
let backgroundImg;
let iteration = 0;
let t = 0;
let MAXITERATION = 8;
let TRANSITIONTIME = 50;
let renderSize = false;
let time = 0,
  interaction_time = 0;
let user_input;
let related_words = [
  "wellness",
  "fitness",
  "vitality",
  "well-being",
  "condition",
  "state",
  "stamina",
  "robustness",
  "vigor",
  "soundness",
  "strength",
  "energy",
];
let prayerPoem = [
  "In the quiet whispers of the morning light, I send forth a prayer, a beacon so bright.",
  "For wellness to envelop me, a comforting shroud, In its gentle embrace, serene and unbowed.",
  "May fitness grace my limbs, a dance of might, With each step, a testament to an enduring fight.",
  "Vitality, surge through me like a river so bold, In your sparkling currents, my story unfolds.",
  "Grant me well-being, a balance so true, A harmony of spirit, in skies of endless blue.",
  "May my condition be steady, my state ever fair, In the garden of health, under tender care.",
  "Stamina, be my ally in the journey ahead, Through trials and triumphs, by you I am led.",
  "Robustness, infuse me with your resilient charm, A fortress within, shielding me from harm.",
  "Vigor, awaken in me a vibrant song, A melody of life, where I truly belong.",
  "Soundness of mind and body, a treasure so rare, In your wisdom, guide me with gentle care.",
  "Strength, be the foundation on which I stand, A pillar of courage, sculpted by a masterful hand.",
  "Energy, ignite my soul with your fiery spark, A beacon to guide me through light and dark.",
  "In this prayer, these words I weave, A tapestry of hope, in which I believe.",
  "May this wish for health, in its purest form, Be granted, be nurtured, be wonderfully warm."
];


let step = 0;
let imagesource = [];
function preload() {
  // load images
  backgroundImg = loadImage("assets/image/background.jpg");
  font = loadFont("assets/font/EraserRegular.ttf");
}
// Initializes canvas and base settings
function setup() {
  let canvas = createCanvas(width, height);
  angleMode(DEGREES);
  seed = random(1000);
  initial_color = color(229, 168, 75);
  final_color = color(193, 44, 31);
  font = textFont(font);

  // add input box
  user_input = createInput();
  // fix the position of input box below the canvas

  user_input.position(width / 2 - user_input.width, height - 65);

  // add button
  let button = createButton("submit");
  button.position(user_input.x + user_input.width, height - 65);
  button.mousePressed(getdata);
}

// Main drawing loop
function draw() {
  if (time <= 10) {
    time += 0.05;
  } else if (step == 2) {
    time += 0.05;
  }
  interaction_time += 1;
  t = time;
  if (t > 10) {
    t = 10;
    wind = 0;
  }
  if (time > 20) {
    time = 20;
  }
  // if typed "riught arrow" once
  if (keyIsDown(39) && interaction_time > 10) {
    if (step == 0 && t == 10) step += 1;
    else if (step == 1) step += 1;
    else if (step == 2 && time == 20) step += 1;
    // interaction_time = 0;
  }

  // if typed "top arrow" once
  if (keyIsDown(38) && interaction_time > 10 && !renderSize) {
    renderSize = true;
    interaction_time = 0;
  }
  // down arrow

  if (keyIsDown(40) && interaction_time > 10 && renderSize) {
    renderSize = false;
    interaction_time = 0;
  }
  let trans;
  if (renderSize) {
    trans = map(interaction_time, 0, TRANSITIONTIME, 0, height);
    translate(width / 2, trans);
  } else {
    trans = map(interaction_time, 0, TRANSITIONTIME, height, 0);
    translate(width / 2, trans);
  }
  if (interaction_time > TRANSITIONTIME) {
    interaction_time = TRANSITIONTIME;
  }
  renderBackground();
  randomSeed(seed);
  branch(50, t * 1.6, 0);
  renderPoems(prayerPoem, 0, 0);
}

function renderBackground() {
  image(backgroundImg, -width / 2, -height, width, height * 2);
  push();
  stroke(0);
  strokeWeight(3);
  fill(153, 188, 172, 100);
  for (let radius = width - 30; radius > 300; radius -= 300) {
    drawHandDrawnCircle(0, 0, radius);
  }

  pop();
}
// Draws a tree branch with recursive subdivision
function branch(len, thickness, iteration) {
  stroke(0);
  strokeWeight(thickness);

  if (iteration < MAXITERATION) {
    let scale = 1;
    if (t > iteration) {
      if (t - iteration < 1) {
        scale = t - iteration;
      }
      drawSCurve(0, 0, len * scale, (len / 3) * scale, iteration);
      if (t < 10)
        wind = map(noise(frameCount / 100), 0, 1, -noiseVar, noiseVar);

      let len_scale = 0.8;
      let thickness_scale = 0.7;

      if (iteration > 2) {
        len_scale = 0.85;
        thickness_scale = 0.7;
      } else if (iteration == 2) {
        thickness *= 1.2;
      }
      push();
      translate(0, -len);
      let randomTheta = random(-thetaVar, thetaVar);
      rotate(theta + randomTheta + wind);
      branch(
        len * random(len_scale, len_scale + 0.1),
        thickness * thickness_scale,
        iteration + 1
      );
      pop();

      push();
      translate(0, -len);
      rotate(-theta - randomTheta + wind);
      branch(
        len * random(len_scale, len_scale + 0.1),
        thickness * thickness_scale,
        iteration + 1
      );
      pop();
      if (iteration > 4) {
        drawLeaves(len * scale, iteration);
      }
    }
  }
}
function drawSCurve(startX, startY, endX, endY, iteration) {
  push();
  translate(startX, startY); // Translate to the starting point
  rotate(-90); // Rotate 90 degrees (PI/2 radians)
  stroke(28, 16, 10);
  noFill();

  // Calculate width and height based on start and end points
  let width = endX - startX;
  let height = endY - startY;

  // Control points for the S-curve
  let ctrl1X = (width / 4) * random(0.5, 1.5);
  let ctrl1Y = (-height / 2) * random(0.5, 1.5);
  let ctrl2X = ((3 * width) / 4) * random(0.5, 1.5);
  let ctrl2Y = (height / 2) * random(0.5, 1.5);

  // Drawing the bezier curve
  bezier(0, 0, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, width, 0);
  let draw_double = false;
  if (iteration < 2) {
    draw_double = true;
  }
  if (draw_double) {
    push();
    bezier(0, 0, ctrl2X, ctrl2Y, ctrl1X, ctrl1Y, width, 0);
    pop();
  }
  pop();
}

// Adds leaf nodes at the end of smaller branches
function drawLeaves(len, recursive_level) {
  push();
  let c = lerpColor(initial_color, final_color, len / 10);
  fill(c);
  noStroke();

  // circle(0, 0, len * random(1));
  let buffer = 1;
  if (time > 10) {
    buffer = time - 9;
  }
  if (recursive_level == MAXITERATION - 1) {
    leafWithTextV1(
      0,
      -len * buffer,
      len * random(0.8, 1),
      100,
      recursive_level
    );
  } else if (random(1) > recursive_level * 0.05) {
    leafWithTextV1(
      0,
      -len * buffer,
      len * random(0.8, 1),
      100,
      recursive_level
    );
  }
  pop();
}
function drawHandDrawnCircle(x, y, diameter) {
  push(); // Start a new drawing state
  translate(x, y); // Move to the center of the circle

  beginShape();
  let radius = diameter / 2;
  for (let angle = 0; angle < 360; angle += 1) {
    // Adding randomness to the radius to create the irregular effect using noise
    let tempRadius = radius + noise(angle / 10, frameCount / 100) * 10;
    let x = tempRadius * cos(angle);
    let y = tempRadius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE); // CLOSE to connect the shape back to the beginning

  pop(); // Restore original state
}
function getdata() {
  // get data from flask server
  axios
    .post("http://127.0.0.1:5000/getdata", {
      user_input: user_input.value(),
    })
    .then(function (response) {
      related_words = response.data.split(",");
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
