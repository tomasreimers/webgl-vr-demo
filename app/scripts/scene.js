/*jshint esversion: 6 */

const THREE = require('THREE');
const AirPlane = require('./objects/airplane.js');
const Sea = require('./objects/sea.js');
const Sky = require('./objects/sky.js');
const AnimationHandler = require('./animation_handler.js');
const Colors = require('./colors.js');

const ninetyaroundx = new THREE.Quaternion();
ninetyaroundx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), - Math.PI / 2);

const ninetyaroundz = new THREE.Quaternion();
ninetyaroundz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), - Math.PI / 2);

function appendLights(scene) {
	const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9);

	const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
	shadowLight.position.set(150, 350, 350);
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	const ambientLight = new THREE.AmbientLight(Colors.white, 0.5);

	scene.add(ambientLight);
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

function appendSea(scene){
	const sea = new Sea();
	sea.mesh.position.y = -600;
	scene.add(sea.mesh);

  scene.animation_handler.add(function () {
    // move waves
    // get the vertices
  	var verts = sea.mesh.geometry.vertices;
  	var l = verts.length;

  	for (var i=0; i<l; i++){
  		var v = verts[i];

  		// get the data associated to it
  		var vprops = sea.waves[i];

  		// update the position of the vertex
  		v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
  		v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

  		// increment the angle for the next frame
  		vprops.ang += vprops.speed;

  	}

  	// Tell the renderer that the geometry of the sea has changed.
  	// In fact, in order to maintain the best level of performance,
  	// three.js caches the geometries and ignores any changes
  	// unless we add this line
  	sea.mesh.geometry.verticesNeedUpdate=true;

  	sea.mesh.rotation.z += 0.005;
  });
}

function appendSky(scene){
	const sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
  scene.animation_handler.add(function () {
    sky.mesh.rotation.z += 0.01;
  });
}

function appendAirplane(scene){
	const airplane = new AirPlane();
	airplane.mesh.scale.set(0.25,0.25,0.25);
	airplane.mesh.position.y = 100;
	airplane.mesh.position.z = 75;
	scene.add(airplane.mesh);
  scene.animation_handler.add(function () {
    airplane.propeller.rotation.x += 0.3;
  });
}

// returns a scene object
module.exports = function Scene() {
  const self = this;

  // create the animation handler
  self.animation_handler = new AnimationHandler();

  // create constants
  self._HEIGHT = window.innerHeight;
  self._WIDTH = window.innerWidth;

  // create the proper THREE scene
  self._three_scene = new THREE.Scene();
	self._three_scene.fog = new THREE.Fog(Colors.white, 100, 950);

  // set up the camera rig
  self._camera_rig = new THREE.Object3D();
  self._three_scene.add(self._camera_rig);

  self._camera_rig.position.x = 0;
  self._camera_rig.position.z = 200;
  self._camera_rig.position.y = 100;

  // constant for all cameras
  const aspectRatio = self._WIDTH / self._HEIGHT;
  const fieldOfView = 60;
  const nearPlane = 1;
  const farPlane = 10000;

  // create the camera
  self._cameraM = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  self._cameraM.position.x = 0;
  self._cameraM.position.z = 0;
  self._cameraM.position.y = 0;

  self._cameraL = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  self._cameraL.position.x = -10;
  self._cameraL.position.z = 0;
  self._cameraL.position.y = 0;

  // because you lock in portrait, we rotate the camera rig in 3d to match viewer, this will
  self._cameraL.rotation.set(
    0,
    0,
    0.5 * (Math.PI)
  );

  self._cameraR = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  self._cameraR.position.x = 10;
  self._cameraR.position.z = 0;
  self._cameraR.position.y = 0;

  self._cameraR.rotation.set(
    0,
    0,
    0.5 * (Math.PI)
  );

  self._camera_rig.add(self._cameraL);
  self._camera_rig.add(self._cameraM);
  self._camera_rig.add(self._cameraR);

  // set up the renderer
  self._renderer = new THREE.WebGLRenderer({
		// alpha: true,
		antialias: true
	});

  self._renderer.setClearColor(Colors.blue, 1);

  self._renderer.setSize(self._WIDTH, self._HEIGHT);
	self._renderer.shadowMap.enabled = true;

  // to keep track of mouse and gyro
  self._mouse_x = 0;
  self._mouse_y = 0;
  self._gyro_alpha = 0;
  self._gyro_beta = 0;
  self._gyro_gamma = 0;

  self._vr = false;

  // methods and callbacks
  self.getDomElement = function () {
    return self._renderer.domElement;
  };

  self.onResize = function () {
    self._HEIGHT = window.innerHeight;
  	self._WIDTH = window.innerWidth;
  	self._renderer.setSize(self._WIDTH, self._HEIGHT);

    // NOTE: L & R only have half the aspect ratio b/c they have half the height (for stereoscopic viewing)

    self._cameraL.aspect = self._WIDTH / (self._HEIGHT / 2);
  	self._cameraL.updateProjectionMatrix();

  	self._cameraM.aspect = self._WIDTH / self._HEIGHT;
  	self._cameraM.updateProjectionMatrix();

    self._cameraR.aspect = self._WIDTH / (self._HEIGHT / 2);
  	self._cameraR.updateProjectionMatrix();
  };

  self.add = function (mesh) {
    self._three_scene.add(mesh);
  };

  self.render = function () {
    if (self._vr) {
      self._renderer.setScissorTest( true );

  		self._renderer.setScissor( 0, 0, self._WIDTH, self._HEIGHT / 2 );
  		self._renderer.setViewport( 0, 0, self._WIDTH , self._HEIGHT / 2 );
      // bottom half of screen
  		self._renderer.render( self._three_scene, self._cameraR );

      self._renderer.setScissor( 0, self._HEIGHT / 2, self._WIDTH, self._HEIGHT / 2 );
  		self._renderer.setViewport( 0, self._HEIGHT / 2, self._WIDTH , self._HEIGHT / 2 );
  		self._renderer.render( self._three_scene, self._cameraL );

  		self._renderer.setScissorTest( false );
    } else {
      self._renderer.setViewport( 0, 0, self._WIDTH, self._HEIGHT );
      self._renderer.render(self._three_scene, self._cameraM);
    }
  };

  self.updateCamera = function () {
    let normalized_x, normalized_y, normalized_z;

    if (self._vr) {
      // NOTE: euler.set(x, y, z, order)
      // The angles alpha, beta and gamma
      // form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
      // 'ZXY' for the device, but 'YXZ' for us
      // the reason we flip Z and Y is because the phone's coordiante system
      // is oriented with the phone facing down, while THREEjs has a coord system
      // facing sideways (y and z axis are flipped)...
      // to fix this we just swap the y and z axis (both in how we pass them
      // and the order we interpret them in), then we negate z so that it makes sense
      // (b/c by just simply swapping y/z, positive y in phone coords, should be negative z in threejs coords)
      const euler = new THREE.Euler(this._gyro_beta, this._gyro_alpha, -1 * this._gyro_gamma, 'YXZ');
      const quat = new THREE.Quaternion();
      quat.setFromEuler(euler);
      // camera looks out the back of the device, not the top, so rotate to counter effect
      quat.multiply(ninetyaroundx);
      // phone locked in portrait, but in landscape, so counter rotate
      quat.multiply(ninetyaroundz);

      // TO SET DIRECTLY:
      // self._camera_rig.rotation.setFromQuaternion(quat);

      // TO SLERP (will cause smoothing effect and reduce jitter):
      self._camera_rig.quaternion.slerp(quat, 0.5);
    } else {
      // flipped b/c x movement means we rotate aroudn y axis
      normalized_y = (self._mouse_x - (self._WIDTH / 2)) / (self._WIDTH / 2);
      normalized_x = (self._mouse_y - (self._HEIGHT / 2)) / (self._HEIGHT / 2);
      normalized_z = 0;

      // dampen
      normalized_x = normalized_x / 4;
      normalized_y = normalized_y / 4;

      self._camera_rig.rotation.set(
        -1 * normalized_x * (Math.PI / 2),
        -1 * normalized_y * (Math.PI),
        normalized_z * (Math.PI)
      );
    }
  };

  self.onMouseMove = function (e) {
    // grab the data
    self._mouse_x = e.screenX;
    self._mouse_y = e.screenY;
  };

  self.onGyroMove = function (e) {
    // grab the data
    self._gyro_beta = THREE.Math.degToRad(e.beta);
    self._gyro_gamma = THREE.Math.degToRad(e.gamma);
    self._gyro_alpha = THREE.Math.degToRad(e.alpha);
  };

  self.onPress = function () {
    self.animation_handler.togglePause();
  };

  self.onVRToggle = function () {
    self._vr = !self._vr;
    if (self._vr) {
      if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    }
  };

  // initalize the objects
  appendLights(self);
  appendSky(self);
  appendSea(self);
  appendAirplane(self);
};
