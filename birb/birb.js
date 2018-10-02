
var birb_height = 200;
// cols follow [height, pos]
var cols = [];
var wait = 0;
var score = 1.0;
var speed = 250;
var loss = true;
var particles = [];
var velocity = 1.3;
var gravity = 1.02;

restart = () => {
  cols = [];
  cols[0] = [20, 150, 180];
  wait = 0;
  score = 1.0;
  speed = 250;
  loss = false;
  particles = [];
  velocity = 1.3;
  gravity = 1.02;
}

function setup() {
  createCanvas(400, 400);
  // hard coded collumn for now
  cols[0] = [20, 150, 180];
  // wait is a counter, every 45 frames I will make another pillar

}

function rand(to, from) {
  // return -> int
  return Math.floor(Math.random() * to) + from
}

function lost() {
  /*console.log("YOU LOOSE");
  remove();
  var loss = document.getElementById("loss");
  loss.className.add("lost");*/
  birb_height = 200;
  loss = true;
}

function birb(height) {
  fill("#333");
	rect(100, height, 20, 20);
  particle_system(100, height, 255);
}

function pillar(height, gap, pos) {
  /*/
   * height is the distance between the middle of the gap and the top of the screen
   * gap is the size of the gap, in pixels
   * pos is the x position of the pillar
  /*/
  fill("#000");
  // draw the top rectangle
  rect(pos, 0, 40, 400/2 - gap/2 + height); 
  // draw the bottom one
  rect(pos, height + 200 + gap/2, 40, 400/2 - gap/2);
}

function touching_pillar(birb_height, pillar) {
  // takes an array of integers, like those stored in `cols`
  let height = pillar[0];
  let gap = pillar[1];
  let pos = pillar[2];
  let hit_top = collidePointRect(100
                                ,birb_height
                                ,pos
                                ,0
                                ,40
                                ,400/2 - gap/2 + height);
  let hit_bottom = collidePointRect(100
                                   ,birb_height
                                   ,pos
                                   ,height + 200 + gap/2
                                   ,40
                                   ,400/2 - gap/2);
  if (hit_top || hit_bottom) {
    return true;
  } else {
    return false;
  }
}

function render_particles() {
  let color = 200;
  for (let i = 0; i < particles.length; i++) {
    fill(color, color, color, particles[i][3]);
    ellipse(particles[i][0], particles[i][1], particles[i][2]);
  }
}

function particle_system(x, y) {
  for (let i = 0; i < 2; i++) {
    particles.push([
      x - rand(1, 5) * i,
      y + rand(-40 - i, 25 + i),
      rand(0.2, 18),
      rand(20, 40 - score + i)
    ])
  }
  render_particles();
  update_particles();
}

function update_particles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i][0] = particles[i][0] - score;
    particles[i][3] = particles[i][3] - 1;
    if (particles[i][3] <= 0 || particles[i][0] <= 0) {
      particles.splice(i, 1)
    }
  }
}

function draw() {
  background("#eee");
  noStroke();
  if (!loss) {
    birb_height += velocity;
    velocity *= gravity;
    birb(birb_height);
    if (wait < speed) {
      wait++;
    } else {
      wait = 0;
      cols.push([rand(-60, 60), rand(20, 90), 400]);
      score += 0.5;
      if (speed > 100) {
        // lower speed == faster
        speed -= 30;
      }
    }
    for (let i = 0; i < cols.length; i++) {
      pillar(cols[i][0], cols[i][1], cols[i][2]);
      cols[i][2] = cols[i][2] - score;
      if (touching_pillar(birb_height, cols[i])) {
        lost();
      }
    }
    textSize(18);
    fill("#000");
    textFont("Serif");
    text("Score: " + (score * 2 - 1), 20, 30);


    if (birb_height > 400 || birb_height < 0) {
      lost();
    }
  } else {
    textSize(32);
    textFont("serif");
    text("press SPC to start", 80, 350 );
  }
}

function keyPressed() {
  // check if it is the up key
  if (keyCode === 32) {
    if (!loss){
      birb_height =  birb_height - 70;
      velocity = 1.5;
    } else {
      restart();
    }
  }
  return false;
}
function mouseClicked() {
  if (!loss){
    birb_height =  birb_height - 70;
    velocity = 1.5;
  } else {
    restart();
  }
  return false;
}
