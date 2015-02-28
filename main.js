/**
 * @projectDescription   Canvas Particles Test
 *
 * @author   Diego Vilariño - http://www.dieg0v.com - @dieg0v - http://www.sond3.com
 * @version  0.1
 */

// Utils.js

function randomRange(min, max) {
  return ((Math.random() * (max - min)) + min);
}

function hexToR(h) {
  return parseInt((cutHex(h)).substring(0, 2), 16);
}

function hexToG(h) {
  return parseInt((cutHex(h)).substring(2, 4), 16);
}

function hexToB(h) {
  return parseInt((cutHex(h)).substring(4, 6), 16);
}

function cutHex(h) {
  return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
}

// end Utils.js

// RequestAnimationFrame.js

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/
 */

if (!window.requestAnimationFrame) {

  window.requestAnimationFrame = ( function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
    })();
}

// end RequestAnimationFrame.js

var MAX_PARTICLES = 500;
var NOW_PARTICLES = 50;
var COLOR = "#ffae23";
var COLORS = [
  // thanks http://flatuicolors.com/
  '#1abc9c', /* aqua    */
  '#16a085', /* aqua    */
  '#2ecc71', /* green   */
  '#27ae60', /* green   */
  '#3498db', /* blue    */
  '#2980b9', /* blue    */
  '#9b59b6', /* purple  */
  '#8e44ad', /* purple  */
  '#f1c40f', /* yellow  */
  '#f39c12', /* orange  */
  '#e67e22', /* orange  */
  '#d35400', /* orange  */
  '#e74c3c' /* red     */
];
var TYPE_PARTICLE = "circle";
var POSITION = "random";
var RANDOM_COLOR = 0;
var VELOCITY = 0.18;
var MAX_VELOCITY = 20;
var BACK_COLOR = '#FFFFFF';
var MAX_SIZE = 8;
var MAX_STROKE_SIZE = 10;
var STROKE_SIZE = 0;
var STROKE_COLOR = '#ffffff';
var OPACITY = 1;
var RANDOM_SIZE = 1;
var PARTICLE_SIZE = 5;
var DEAD_PARTICLE = 0;
var SHADOW_BLUR = 0;

var mousePosX = window.innerWidth / 2;
var mousePosY = window.innerHeight / 2;
var stats;
var canvas;
var c;
var particleArray = [];

$(window).resize(function() {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function createParticle() {

  var particle = {};

  switch (POSITION) {
    case 'mouse':
      particle.x = mousePosX;
      particle.y = mousePosY;
      break;
    case 'center':
      particle.x = window.innerWidth / 2;
      particle.y = window.innerHeight / 2;
      break;
    case 'random':
      particle.x = randomRange(0, window.innerWidth);
      particle.y = randomRange(0, window.innerHeight);
      break;
  }

  particle.xSpeed = randomRange((-1) * VELOCITY, VELOCITY);
  particle.ySpeed = randomRange((-1) * VELOCITY, VELOCITY);

  var size;
  if (RANDOM_SIZE == 1) {
    size = randomRange(3, MAX_SIZE);
  } else {
    size = PARTICLE_SIZE;
  }
  particle.size = size;

  var color = COLORS[Math.floor(Math.random() * COLORS.length)];
  particle.color = color;

  return particle;
}

window.onload = function() {
  canvas = document.getElementById("canvas");
  c = canvas.getContext("2d");
  c.canvas.width = window.innerWidth;
  c.canvas.height = window.innerHeight;

  generateParticles();
  animate();
}

function generateParticles() {
  for (var i = 0; i < MAX_PARTICLES; i++) {
    particleArray.push(createParticle());
  }
}

function draw() {

  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  c.fillStyle = BACK_COLOR;
  c.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (var i = 0; i < NOW_PARTICLES; i++) {

    var particle = particleArray[i];
    c.beginPath();
    c.lineWidth = STROKE_SIZE;
    c.fillStyle = particle.color;

    if (SHADOW_BLUR > 0) {
      c.shadowBlur = SHADOW_BLUR;
      c.shadowOffsetX = 1;
      c.shadowOffsetY = 1;
      c.shadowColor = "rgba(100, 100, 100, 1)";
    } else {
      c.shadowBlur = null;
      c.shadowOffsetX = 0;
      c.shadowOffsetY = 0;
      c.shadowColor = "rgba(100, 100, 100, 0)";
    }

    var particle_stroke_color = "rgba(" + hexToR(STROKE_COLOR) + ", " + hexToG(STROKE_COLOR) + ", " + hexToB(STROKE_COLOR) + ", " + OPACITY + ")";
    c.strokeStyle = particle_stroke_color;

    switch (TYPE_PARTICLE) {
      case 'rect':
        c.fillRect(particle.x, particle.y, particle.size, particle.size);
        if (STROKE_SIZE > 0) {
          c.strokeRect(particle.x, particle.y, particle.size, particle.size);
        }
        break;
      case 'circle':
        var radius = particle.size / 2;
        c.arc(particle.x, particle.y, radius, 0, 2 * Math.PI, false);
        c.fill();
        if (STROKE_SIZE > 0) {
          c.stroke();
        }
        break;
      case 'triangle':
        c.moveTo(particle.x, particle.y);
        c.lineTo(particle.x + (particle.size * 2), particle.y);
        c.lineTo(particle.x + particle.size, particle.y - particle.size);
        c.lineTo(particle.x, particle.y);
        c.fill();
        if (STROKE_SIZE > 0) {
          c.stroke();
        }
        break;
    }

    c.closePath();

    particle.x = particle.x + particle.xSpeed;
    particle.y = particle.y + particle.ySpeed;

    if (DEAD_PARTICLE == 1) {
      particle.size = particle.size * (0.9 + (randomRange(1, 10) / 100));
      if (particle.size <= 0.25) {
        particleArray[i] = createParticle();
      }
    } else {
      if (particle.x < -(particle.size) ||
        particle.y < -(particle.size) ||
        particle.x > window.innerWidth + particle.size ||
        particle.y > window.innerHeight + particle.size) {
        particleArray[i] = createParticle();
      }

    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
}
