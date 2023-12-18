let width = window.innerWidth,
  height = window.innerHeight;
let thetaVar = 10,
  theta = 20;
let seed = 0;
let noiseVar = 1;
let initial_color, final_color;
let wind = 0;
let iteration = 0;
let t = 0;
let MAXITERATION = 7;
let TRANSITIONTIME = 50;
let appleImg,
  backgroundImg,
  basketImg,
  scrollImg,
  frameImg,
  sceneImg,
  penImg,
  seedImg,
  instructionImg,
  characterImg,
  dialogImg;
let score;
let time = 0;
let isSeed = true;
let stage = 0;
let step = 0;
let apples = [];
let box = {};
let word_in_box = [];
let new_words = [];
let story_keywords = [];
let story = "";
let type_index = 0;
let speed = 1;
let keywordsZone, storyZone;
let store = [
  "Rich",
  "Healthy",
  "Loved",
  "Successful",
  "Happy",
  "Wealthy",
  "Prosperous",
  "Content",
  "Fulfilled",
  "Peaceful",
  "Strong",
  "Wise",
  "Generous",
  "Lucky",
  "Creative",
  "Confident",
  "Independent",
  "Adventurous",
  "Grateful",
  "Inspiring",
];
let wish = "";
let isNew = true;
let storyCheck = false;

function preload() {
  // load images
  backgroundImg = loadImage("assets/image/background.jpg");
  appleImg = loadImage("assets/image/apple.png");
  basketImg = loadImage("assets/image/basket.png");
  scrollImg = loadImage("assets/image/scroll.png");
  frameImg = loadImage("assets/image/frame.png");
  penImg = loadImage("assets/image/pen.png");
  sceneImg = loadImage("assets/image/background1.png");
  seedImg = loadImage("assets/image/seed.png");
  characterImg = loadImage("assets/image/character1.png");
  instructionImg = loadImage("assets/image/instruction.png");
  dialogImg = loadImage("assets/image/dialog.png");
  // load font
  font = loadFont("assets/font/jr!ha___.ttf");
}
// Initializes canvas and base settings
function setup() {
  initiate();
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
}

function draw() {
  renderBackground();
  createApple();
  drawBox(keywordsZone, "keyword");
  drawBox(storyZone, "story");
  renderStoryWords();
  renderStep();
  if (stage == 1) {
    if (time <= 10) {
      time += 0.05;
    }
    t = time;

    push();
    randomSeed(seed);
    translate(
      keywordsZone.x + keywordsZone.w / 2,
      keywordsZone.y + keywordsZone.h / 2
    );
    branch(60, t * 1.6, 0, 0, 0);
    pop();
  }

  // clear random seed
  randomSeed();
  for (let apple of apples) {
    drawApple(apple);
  }
  renderInstruction();
  if (score != undefined) {
    showResult(score);
  }
}

/**
 *  Render the apple
 * @param {Apple} apple
 */
function drawApple(apple) {
  if (apple.isDragging) {
    apple.x = mouseX + apple.dragOffsetX;
    apple.y = mouseY + apple.dragOffsetY;
  }
  apple.show();
}

/**
 * Render the story words
 * including the scroll, the story and the words
 * check the score of the story
 */
function renderStoryWords() {
  image(scrollImg, 0, 0.01 * height, width * 0.4, height * 0.7);
  textSize(18);
  fill(0);
  story = story.replace(",", " \n");
  story = story.replace(".", "\n");
  text(story.substring(0, type_index), width * 0.2, height * 0.4);

  if (frameCount % speed == 0) {
    if (type_index < story.length) {
      type_index++;
    }
    if (type_index == story.length && storyCheck) {
      checkStory();
      storyCheck = false;
    }
  }
}

/**
 * Render the 5 steps of the keyword selection
 */
function renderStep() {
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < story_keywords.length; i++) {
    image(
      penImg,
      width * 0.5 + i * width * 0.1,
      height * 0.8,
      height * 0.1,
      height * 0.1
    );
    text(story_keywords[i], width * 0.485 + i * width * 0.1, height * 0.9);
  }
}
/**
 * watch the words in the trigger zone
 * @param {*} box trigger zone
 * @param {*} type  the type of the box (keyword or story)
 */
function watchWord(box, type) {
  if (type == "keyword") {
    for (let apple of apples) {
      if (apple.isInside(box)) {
        if (apple.isSeed) {
          getKeywords(apple.text);
          apples.splice(apples.indexOf(apple), 1);
        }
      }
    }
  } else if (type == "story") {
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
/**
 *  Draw the trigger zone
 * @param {*} box  the triger zone
 * @param {*} type the type of the box (keyword or story)
 */
function drawBox(box, type) {
  fill(139, 69, 19);
  if (type == "keyword") {
    noFill();
    // rect(box.x, box.y, box.w, box.h);
  } else {
    image(basketImg, box.x, box.y, box.w, box.h);
  }
}

/**
 * Create apples based on the keywords
 * Could be apple or seed
 */
function createApple() {
  for (let word of new_words) {
    let isExist = false;
    for (let apple of apples) {
      if (apple.text == word) {
        isExist = true;
        break;
      }
    }
    if (isExist) continue;
    if (!isNew) {
      apples.push(
        new Apple(
          random(width * 0.65, width * 0.8),
          random(height * 0.15, height * 0.25),
          word,
          isNew
        )
      );
    } else {
      apples.push(
        new Apple(
          random(width * 0.5, width * 0.95),
          random(height * 0.8, height * 0.95),
          word,
          isNew
        )
      );
    }
  }
  new_words = [];
}
/**
 * Render the background including the paper, the frame, the scene and the character
 */
function renderBackground() {
  image(backgroundImg, 0, 0, width, height);
  image(sceneImg, width * 0.45, height * 0.13, width * 0.5, height * 0.5);
  image(frameImg, width * 0.4, 0, width * 0.6, height * 0.8);
  renderCharacter();
}

/**
 * Render the character and the dialog
 */
function renderCharacter() {
  // character
  image(characterImg, width * 0.1, height * 0.8, height * 0.2, height * 0.2);
  // dialog
  image(dialogImg, width * 0.25, height * 0.75, width * 0.2, height * 0.25);

  // split the text into two lines

  let wishes = wish.split(" ");
  let wish_text = "";
  for (let i = 0; i < wishes.length; i++) {
    if (i % 5 == 0 && i != 0) {
      wishes[i] = wishes[i] + "\n";
    }

    wish_text += wishes[i] + " ";
  }
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(wish_text, width * 0.35, height * 0.85);
}

/**
 *
 * @param {Number} len  The length of the branch
 * @param {Number} thickness  The thickness of the branch
 * @param {Number} iteration  The current iteration
 * @param {Number} x  The x coordinate of the branch
 * @param {Number} y  The y coordinate of the branch
 */
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

/**
 *  Draws an S-curve with random control points
 * @param {Number} startX  The starting x coordinate
 * @param {Number} startY  The starting y coordinate
 * @param {Number} endX  The ending x coordinate
 * @param {Number} endY  The ending y coordinate
 * @param {Number} iteration   The current iteration
 */
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
/**
 * Get related keywords from the openai api
 */
function initiate() {
  axios
    .post("http://127.0.0.1:5000/initiate", {
      keyword: store[Math.floor(Math.random() * store.length)],
    })
    .then(function (response) {
      console.log(response.data);
      wish = response.data.wish;
      new_words = response.data.related;
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * Get related keywords from the openai api
 * @param {String} text the user selected text
 */
function getKeywords(text) {
  stage = 1;
  t = 0;
  time = 0;
  axios
    .post("http://127.0.0.1:5000/getKeywords", {
      user_input: text,
    })
    .then(function (response) {
      isNew = false;
      console.log(response.data);
      if (Array.isArray(response.data)) {
        new_words = response.data;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * Get a poem from the openai api, based on the keywords
 * @param {Array} keywords the user selected keywords
 */
function getStory(keywords) {
  axios
    .post("http://127.0.0.1:5000/getStory", {
      keywords: keywords,
    })
    .then(function (response) {
      story = response.data;
      type_index = 0;

      console.log(story);
      storyCheck = true;
      word_in_box = [];
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * Check the story score from the openai api
 */
function checkStory() {
  axios
    .post("http://127.0.0.1:5000/checkStory", {
      story: story,
      wish: wish,
    })
    .then(function (response) {
      score = response.data;
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * Resize the canvas when the window size changes
 */
function windowResized() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderBackground();
  resizeCanvas(width, height);
}

/**
 * Render instruction when press i
 */
function renderInstruction() {
  if (keyIsPressed && key == "i") {
    background(0, 0, 0, 150);
    image(instructionImg, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
  }
  if (keyIsPressed && key == "r") {
    location.reload();
  }
}

/**
 * Render the result when the story is scored
 */
function showResult() {
  background(0, 0, 0, 150);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  let wishes = wish.split(" ");
  let wish_text = "";
  for (let i = 0; i < wishes.length; i++) {
    if (i % 10 == 0 && i != 0) {
      wishes[i] = wishes[i] + "\n";
    }

    wish_text += wishes[i] + " ";
  }
  text("'" + wish_text + "'", width / 2, height * 0.4);
  if (score == 1)
    text("Thanks for making it come true!", width / 2, height * 0.6);
  else text("You almost make it come true!", width / 2, height * 0.6);
  textSize(20);
  text("Press r to restart", width / 2, height * 0.8);
}

////////////////////////
// Mouse Event
////////////////////////

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
function mousePressed() {
  for (let apple of apples) {
    apple.checkPressed();
  }
}
