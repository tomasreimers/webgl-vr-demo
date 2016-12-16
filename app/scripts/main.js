/*jshint esversion: 6 */

const THREE = require('THREE');
const Scene = require('./scene.js');

let scene;

function loop(){
  // animate
  scene.animation_handler.tick();

  // update camera
  scene.updateCamera();

	// render the scene
  scene.render();

	// call the loop function again
	requestAnimationFrame(loop);
}

function init() {
  // create the scene
  scene = new Scene();

  // wire up the resize handler
  window.addEventListener('resize', scene.onResize, false);

  // keep track of mouse and gyro
  window.addEventListener('mousemove', scene.onMouseMove, false);
  window.addEventListener('deviceorientation', scene.onGyroMove, false);

  // add the scene to the dom
  const stage = document.getElementById('stage');
  stage.appendChild(scene.getDomElement());

  // watch for stage click
  stage.addEventListener('click', scene.onPress, false);
  // stage.addEventListener('touchend', scene.onPress, false);

  // watch for VR toggle
  const toggleButton = document.getElementById('toggle-vr');
  toggleButton.addEventListener('click', scene.onVRToggle, false);
  // toggleButton.addEventListener('touchend', scene.onVRToggle, false);

  // begin the animation loop
	loop();
}

init();
