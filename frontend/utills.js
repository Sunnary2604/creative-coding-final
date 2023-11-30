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
function leafWithTextV2(x, y, size, opecity, recursive_level) {

}