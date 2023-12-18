class Apple {
  constructor(x, y, word, seed) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.text = word;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.isSeed = seed;
  }

  show() {
    //appleImg
    if (this.isSeed) {
      image(
        seedImg,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    } else {
      image(
        appleImg,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }

    textAlign(CENTER);
    push();
    stroke(0);
    fill(255);
    // change blank to \n
    this.text = this.text.replace(" ", "\n");

    text(this.text, this.x, this.y + 5); // 苹果上的文字
    pop();
  }

  checkPressed() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.size / 2) {
      this.isDragging = true;
      this.dragOffsetX = this.x - mouseX;
      this.dragOffsetY = this.y - mouseY;
    }
  }
  checkReleased() {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  isInside(zone) {
    return (
      this.x > zone.x &&
      this.x < zone.x + zone.w &&
      this.y > zone.y &&
      this.y < zone.y + zone.h
    );
  }
}
