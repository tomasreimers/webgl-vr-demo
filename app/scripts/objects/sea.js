const THREE = require('THREE');
const Colors = require('../colors.js');

module.exports = function(){
	var geom = new THREE.CylinderGeometry(650,600,100,40,10);
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	geom.mergeVertices();
	var l = geom.vertices.length;
	this.waves = [];

	for (var i=0; i<l; i++){
		var v = geom.vertices[i];
		this.waves.push({y:v.y,
										 x:v.x,
										 z:v.z,
										 ang:Math.random()*Math.PI*2,
										 amp:5 + Math.random()*15,
										 speed:0.016 + Math.random()*0.032
										});
	}
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent:true,
		opacity:0.8,
		shading:THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;

};
