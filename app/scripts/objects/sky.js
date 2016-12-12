const THREE = require('THREE');
const Colors = require('../colors.js');
const Cloud = require('./cloud.js');

module.exports = function(){
	this.mesh = new THREE.Object3D();
	this.nClouds = 20;
	var stepAngle = Math.PI*2 / this.nClouds;
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();
		var a = stepAngle*i;
		var h = 750 + Math.random()*200;
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;
		c.mesh.rotation.z = a + Math.PI/2;
		c.mesh.position.z = -400-Math.random()*400;
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);
		this.mesh.add(c.mesh);
	}
};
