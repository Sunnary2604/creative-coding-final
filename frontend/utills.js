/**
 *
 * @param {number} x    x position of the leaf
 * @param {number} y    y position of the leaf
 * @param {number} size     size of the leaf
 * @param {number} opecity  opecity of the leaf
 * @param {number} recursive_level  recursive level of the leaf
 */
function leafWithTextV1(x, y, size, opecity, recursive_level) {
  push();
  translate(x, y);
  fill(255, 255, 255, opecity);
  stroke(color(255, 255, 255, opecity));
  // use noise to change the size of the circle
  let offset_x = noise(x / 100, frameCount / 100) * 10;
  let offset_y = noise(y / 100, frameCount / 100) * 10;
  // time is tge global variable that is used to control the animation
  s = map(abs(time - 15), 5, 0, 10, size);
  // add text from related words
  if (size > 20 && step == 3)
    if (related_words.length > 0) {
      let index = floor(random(related_words.length));
      let word = related_words[index];
      textSize(20);
      text(word, offset_x, offset_y);
    }
  if (step <= 2) {
    circle(offset_x, offset_y, s);
  }

  pop();
}
// todo：make the leaf more interesting;
// make the animation not simple linear transition
function leafWithTextV2(x, y, size, opecity, recursive_level) {}
/**
 * 
 * @param {Array} prayers 
 * @param {Number} x 
 * @param {Number} y 
 */
function renderPoemsV1(prayers, x, y) {
  push();
  translate(x, y);
  charSpacingAngleDeg = 5;
  textSize(10);
  textAlign(CENTER, BASELINE);
  // render text in circle

  for (let i = 0; i < prayers.length; i++) {
    let subsentence = prayers[i].split(",");
    for (let j = 0; j < subsentence.length; j++) {
      rotateText(-200 * (i - 2), i * -30, 400 - j * 30, subsentence[j]);
    }
  }
  pop();
}

// todo: make the text more interesting
function renderPoemsV2(prayers, x, y) {}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} radius 
 * @param {String} txt 
 */
function rotateText(x, y, radius, txt) {
  // Comment the following line to hide debug objects
  // drawDebug(x, y, radius);

  // Split the chars so they can be printed one by one
  chars = txt.split("");

  // Decide an angle
  charSpacingAngleDeg = 90;

  // https://p5js.org/reference/#/p5/textAlign
  textAlign(CENTER, BASELINE);
  textSize(20);
  fill("black");
  noStroke();

  // https://p5js.org/reference/#/p5/push
  // Save the current translation matrix so it can be reset
  // before the end of the function
  push();

  // Let's first move to the center of the circle
  translate(x, y);

  // First rotate half back so that middle char will come in the center
  rotate(radians((-chars.length * charSpacingAngleDeg) / 2));

  for (let i = 0; i < chars.length; i++) {
    text(chars[i], 0, -radius);

    // Then keep rotating forward per character
    rotate(radians(charSpacingAngleDeg));
  }

  // Reset all translations we did since the last push() call
  // so anything we draw after this isn't affected
  pop();
}
