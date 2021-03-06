/**
 * Canvas Particles
 *
 * based on work of Diego Vilariño - https://github.com/dieg0v/Html5-canvas-particles
 * @version 0.1
 *
 */

/** begin RequestAnimationFrame.js
 *
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/
 *
 */

if (!window.requestAnimationFrame) {

  window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function (callback) {
             window.setTimeout(callback, 1000 / 60);
           };
  })();
}

// end RequestAnimationFrame.js

var BACK_COLOR = '#FFFFFF';
var MAX_PARTICLES = 500;
var NOW_PARTICLES = 50;
var VELOCITY = 0.18;
var MIN_SIZE = 3;
var MAX_SIZE = 8;
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

var canvas;
var c;
var particleArray = [];

function randomRange(min, max) {
  return ((Math.random() * (max - min)) + min);
}

function createParticle() {

  var particle = {};

  particle.x = randomRange(0, window.innerWidth);
  particle.y = randomRange(0, window.innerHeight);

  particle.xSpeed = randomRange((-1) * VELOCITY, VELOCITY);
  particle.ySpeed = randomRange((-1) * VELOCITY, VELOCITY);

  particle.size  = randomRange(MIN_SIZE, MAX_SIZE);
  particle.color = COLORS[Math.floor(Math.random() * COLORS.length)];

  return particle;
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
    c.fillStyle = particle.color;

    var radius = particle.size / 2;
    c.arc(particle.x, particle.y, radius, 0, 2 * Math.PI, false);
    c.fill();

    c.closePath();

    particle.x = particle.x + particle.xSpeed;
    particle.y = particle.y + particle.ySpeed;

    if (particle.x < -(particle.size) ||
        particle.y < -(particle.size) ||
        particle.x > window.innerWidth + particle.size ||
        particle.y > window.innerHeight + particle.size) {
      particleArray[i] = createParticle();
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
}

$(window).resize(function () {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.onload = function () {
  canvas = document.getElementById("canvas");
  c = canvas.getContext("2d");
  c.canvas.width = window.innerWidth;
  c.canvas.height = window.innerHeight;

  generateParticles();
  animate();
}
