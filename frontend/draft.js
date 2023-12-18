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
let MAXITERATION = 7;
let TRANSITIONTIME = 50;
let renderSize = false;
let appleImg;
let basketImg;
let scrollImg;
let frameImg;
let backgorund_1;
let penImg;
let seedImg;
let score;
let time = 0,
  interaction_time = 0;
let isSeed = true;
let stage = 0;
let step = 0;
let imagesource = [];
let appleTime = 0;
let apples = [];
let box = {};
let word_in_box = [];
let new_words = [];
let story_keywords = [];
let story = "";
let type_index = 0;
let speed = 1;
let keywordsZone;
let store = [
  "Peace",
  "Love",
  "Joy",
  "Happiness",
  "Hope",
  "Kindness",
  "Harmony",
  "Beauty",
  "Faith",
  "Grace",
  "Wisdom",
  "Courage",
  "Freedom",
  "Magic",
  "Wonder",
  "Dream",
  "Miracle",
  "Bliss",
  "Tranquility",
  "Serenity",
];
let applePositions = [];

function preload() {
  // load images
  backgroundImg = loadImage("assets/image/background.jpg");
  appleImg = loadImage("assets/image/apple.png");
  basketImg = loadImage("assets/image/basket.png");
  scrollImg = loadImage("assets/image/scroll.png");
  frameImg = loadImage("assets/image/frame.png");
  penImg = loadImage("assets/image/pen.png");
  backgorund_1 = loadImage("assets/image/background1.png");
  seedImg = loadImage("assets/image/seed.png");
  instructionImg = loadImage("assets/image/instruction.png");
  // load font
  font = loadFont("assets/font/jr!ha___.ttf");
}
// Initializes canvas and base settings
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  seed = random(1000);
  initial_color = color(229, 168, 75);
  final_color = color(193, 44, 31);
  font = textFont(font);
  keywordsZone = {
    x: width * 0.6,
    y: height * 0.4,
    w: width * 0.25,
    h: height * 0.1,
  };
  storyZone = {
    x: width * 0.8,
    y: height * 0.6,
    w: width * 0.15,
    h: height * 0.2,
  };
  // initialize the words
  for (let i = 0; i < 3; i++) {
    let index = Math.floor(Math.random() * store.length);
    if (new_words.includes(store[index])) {
      i--;
      continue;
    }
    new_words.push(store[index]);
  }
}

function draw() {
  renderBackground();
  createApple();
  drawBox(keywordsZone, "keyword");
  drawBox(storyZone, "story");
  renderStoryWords();

  if (stage == 1) {
    if (time <= 10) {
      time += 0.05;
    } 
    interaction_time += 1;
    t = time;

    push();
    randomSeed(seed);
    translate(
      keywordsZone.x + keywordsZone.w / 2,
      keywordsZone.y + keywordsZone.h / 2
    );
    applePositions = [];
    branch(60, t * 1.6, 0, 0, 0);
    pop();
  }

  // clear random seed
  randomSeed();
  for (let apple of apples) {
    drawApple(apple, apples.indexOf(apple));
  }
  renderInstruction();
}
function drawApple(apple, index) {
  if (apple.isDragging) {
    apple.x = mouseX + apple.dragOffsetX;
    apple.y = mouseY + apple.dragOffsetY;
  }
  apple.show();
}

function triggerFunction(text) {
  stage = 1;
  t = 0;
  time = 0;
  getKeywords(text);
}
function renderStoryWords() {
  // render story words on the screen
  image(scrollImg, 0, 0.01 * height, width * 0.35, height * 0.8);

  textSize(18);
  renderStep();
  story = story.replace(",", " \n");
  story = story.replace(".", "\n");
  text(story.substring(0, type_index), width * 0.175, height * 0.4);

  if (frameCount % speed == 0) {
    if (type_index < story.length) {
      type_index++;
    }
  }
}
function renderStep() {
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < story_keywords.length; i++) {
    image(
      penImg,
      width * 0.515 + i * width * 0.075,
      height * 0.85,
      height * 0.1,
      height * 0.1
    );
    text(story_keywords[i], width * 0.5 + i * width * 0.075, height * 0.9);
  }
}

function watchWord(box, type) {
  if (type == "keyword") {
    for (let apple of apples) {
      // if in the zone
      if (apple.isInside(box)) {
        if (apple.isSeed) {
          triggerFunction(apple.text);
          apples.splice(apples.indexOf(apple), 1);
        }
      }
    }
  }
  if (type == "story") {
    for (let apple of apples) {
      // if in the zone
      if (apple.isInside(box)) {
        if (apple.isSeed) continue;
        story_keywords = story_keywords.concat(apple.text);
        if (story_keywords.length > 5) {
          story_keywords = story_keywords.slice(1, 6);
        }
        if (story_keywords.length == 5) getStory(story_keywords);
        apples.splice(apples.indexOf(apple), 1);
      }
    }
  }
}

function drawBox(box, type) {
  // brown
  fill(139, 69, 19);
  if (type == "keyword") {
    noFill();
    // rect(box.x, box.y, box.w, box.h);
  } else {
    image(basketImg, box.x, box.y, box.w, box.h);
  }
}
function mousePressed() {
  for (let apple of apples) {
    apple.checkPressed();
  }
}
function createApple() {
  // for each item in new_words, create an apple
  for (let word of new_words) {
    // check if the word is already in the apple list
    let isExist = false;
    for (let apple of apples) {
      if (apple.text == word) {
        isExist = true;
        break;
      }
    }
    if (isExist) continue;
    if (!store.includes(word)) {
      apples.push(
        new Apple(
          random(width * 0.65, width * 0.8),
          random(height * 0.15, height * 0.25),
          word,
          store.includes(word)
        )
      );
    } else {
      apples.push(
        new Apple(
          random(width * 0.5, width * 0.95),
          random(height * 0.8, height * 0.95),
          word,
          store.includes(word)
        )
      );
    }
  }
  new_words = [];
}

function mouseReleased() {
  for (let apple of apples) {
    apple.checkReleased();
  }
  watchWord(keywordsZone, "keyword");
  watchWord(storyZone, "story");
}

function mouseDragged() {
  for (let apple of apples) {
    if (apple.isDragging) {
      apple.x = mouseX + apple.dragOffsetX;
      apple.y = mouseY + apple.dragOffsetY;
    }
  }
}

function renderBackground() {
  image(backgroundImg, 0, 0, width, height);

  image(backgorund_1, width * 0.45, height * 0.13, width * 0.5, height * 0.5);
  image(frameImg, width * 0.4, 0, width * 0.6, height * 0.8);
}
// Draws a tree branch with recursive subdivision
function branch(len, thickness, iteration, x, y) {
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
      let randomTheta = random(-thetaVar, thetaVar);
      let newX = x + cos(theta + randomTheta + wind) * len;
      let newY = y - sin(theta + randomTheta + wind) * len;

      push();
      translate(0, -len);

      rotate(theta + randomTheta + wind);
      branch(
        len * random(len_scale, len_scale + 0.1),
        thickness * thickness_scale,
        iteration + 1,
        newX,
        newY
      );
      pop();
      newX = x + cos(theta + randomTheta + wind) * len;
      newY = y - sin(theta + randomTheta + wind) * len;

      push();
      translate(0, -len);
      rotate(-theta - randomTheta + wind);
      branch(
        len * random(len_scale, len_scale + 0.1),
        thickness * thickness_scale,
        iteration + 1,
        newX,
        newY
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
  translate(startX, startY);
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
function getKeywords(text) {
  axios
    .post("http://127.0.0.1:5000/getKeywords", {
      user_input: text,
    })
    .then(function (response) {
      console.log(response.data);
      if (Array.isArray(response.data)) {
        new_words = response.data;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getStory(text) {
  axios
    .post("http://127.0.0.1:5000/getStory", {
      keywords: text,
    })
    .then(function (response) {
      story = response.data;
      type_index = 0;
      checkStory();
      console.log(story);

      word_in_box = [];
    })
    .catch(function (error) {
      console.log(error);
    });
}
function checkStory() {
  axios
    .post("http://127.0.0.1:5000/checkStory", {
      story: story,
      keywords: story_keywords[0],
    })
    .then(function (response) {
      score = response.data;
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// if change screen size, resize canvas
function windowResized() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderBackground();
  resizeCanvas(width, height);
}

function renderInstruction() {
  if (keyIsPressed && key == "i") {
    background(0, 0, 0, 150);
    image(instructionImg, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
  }
}
