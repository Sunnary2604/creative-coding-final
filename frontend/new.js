// Global variables for canvas dimensions, branching parameters, and color settings
let width = window.innerWidth,
  height = window.innerHeight;
let seed = 0; // Seed for random number generation
let backgroundImg;
let apples = [];
let box = {};
let word_in_box = [];
let new_words = [];
let story_keywords = [];
let story = "";
let type_index = 0;
let speed = 1;
function preload() {
  // load images
  backgroundImg = loadImage("assets/image/background.jpg");
  font = loadFont("assets/font/EraserRegular.ttf");
}
// Initializes canvas and base settings
function setup() {
  let canvas = createCanvas(width, height);
  box = {
    x: width / 2,
    y: height - 200,
    size: 100,
  };
  angleMode(DEGREES);
  let store = [
    "happy",
    "rich",
    "healthy",
    "beautiful",
    "wisdom",
    "love",
    "fun",
    "peace",
  ];
  // random three words
  for (let i = 0; i < 3; i++) {
    // get random index
    let index = Math.floor(Math.random() * store.length);
    //check if the word is already in the list
    if (new_words.includes(store[index])) {
      i--;
      continue;
    }
    new_words.push(store[index]);
  }
}
// Main drawing loop
function draw() {
  //   translate(width / 2, height / 2);
  renderBackground();

  // draw apple
  drawBox(box);
  renderStoryWords();
  createApple();
  for (let apple of apples) {
    drawApple(apple);
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
    apples.push({
      x: random(100, width - 100),
      y: random(100, height - 300),
      size: 30,
      text: word,
      isDragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
    });
  }
  new_words = [];
}
function renderStoryWords() {
  // render story words on the screen
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < story_keywords.length; i++) {
    text(story_keywords[i], width - 100, 20 + i * 20);
  }
  textSize(10);
  // render story on the screen, max 200px, if exceed, new line
  // split story into array
  story = story.replace(",", " \n");
  story = story.replace(".", "\n");
  text(story.substring(0, type_index), width / 2 - 100, 100);
  if (frameCount % speed == 0) {
    if (type_index < story.length) {
      type_index++;
    }
  }
}

function watchWord(box) {
  for (let apple of apples) {
    if (
      apple.x > box.x &&
      apple.x < box.x + box.size &&
      apple.y > box.y &&
      apple.y < box.y + box.size
    ) {
      word_in_box.push(apple.text);
      // remove apple
      apples.splice(apples.indexOf(apple), 1);
    } else {
      if (word_in_box.includes(apple.text)) {
        word_in_box.splice(word_in_box.indexOf(apple.text), 1);
      }
    }
  }
  console.log(word_in_box);
  // check if word_in_box changed
  if (word_in_box.length > 0) {
    story_keywords = story_keywords.concat(word_in_box);
    getKeywords();
    console.log("story_keywords: ", story_keywords);
    if (story_keywords.length == 1) {
      story +=
        "In lands of dreams where wishes bloom, Our tale begins about the guy's wish of '" +
        story_keywords[0] +
        "'.";
      word_in_box = [];
    } else {
      getStory();
    }
  }
}

function renderBackground() {
  image(backgroundImg, 0, 0, width, height);
}

function drawApple(apple) {
  if (apple.isDragging) {
    apple.x = mouseX + apple.dragOffsetX;
    apple.y = mouseY + apple.dragOffsetY;
  }

  // Draw apple
  fill(255, 0, 0);
  ellipse(apple.x, apple.y, apple.size, apple.size);

  // Text
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(apple.text, apple.x, apple.y);
}

function drawBox(box) {
  // brown
  fill(139, 69, 19);
  rect(box.x, box.y, box.size, box.size);
}



// if change screen size, resize canvas
function windowResized() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderBackground();
  resizeCanvas(width, height);
}

function getKeywords() {
  // get data from flask server
  axios
    .post("http://127.0.0.1:5000/getKeywords", {
      user_input: word_in_box,
    })
    .then(function (response) {
      console.log(response.data);
      new_words.push(response.data.noun);
      new_words.push(response.data.verb);
      new_words.push(response.data.pos);
      //   new_words .append(response.data.);
      // if is string, convert to array
      //   let temp = response.data;
      //   if (typeof response.data === "string") {
      //     temp = temp.replace("[", "");
      //     temp = temp.replace("]", "");
      //     temp = temp.split(",");
      //   }
      //   new_words = temp;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getStory() {
  // get data from flask server
  axios
    .post("http://127.0.0.1:5000/getStory", {
      story: story,
      keywords: word_in_box,
      section: story_keywords.length - 1,
    })
    .then(function (response) {
      // remove \n after comma
      if (story_keywords.length == 2) {
        // story = "";
      }
      // response.data = response.data.replace(",\n", ", ");
      story += "\n--- Section " + (story_keywords.length - 1) + " ---\n";
      story += response.data;
      // add ----- to the end of the story

      console.log(story);

      // if is string, convert to array
      //   let temp = response.data;
      //   if (typeof response.data === "string") {
      //     temp = temp.replace("[", "");
      //     temp = temp.replace("]", "");
      //     temp = temp.split(",");
      //   }
      //   new_words = temp;
      word_in_box = [];
    })
    .catch(function (error) {
      console.log(error);
    });
}
