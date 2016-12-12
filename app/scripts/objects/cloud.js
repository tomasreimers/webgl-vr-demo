const THREE = require('THREE');
const Colors = require('../colors.js');

module.exports = function(){
	this.mesh = new THREE.Object3D();
	var geom = new THREE.BoxGeometry(20,20,20);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,
		transparent:true,
		opacity:0.5,
	});

	var nBlocs = 3+Math.floor(Math.random()*8);
	for (var i=0; i<nBlocs; i++ ){
		var m = new THREE.Mesh(geom, mat);
		m.position.x = i*20;
		m.position.y = Math.random()*20;
		m.position.z = Math.random()*50;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		var s = 2 + Math.random()*0.9;
		m.scale.set(s,s,s);
		m.castShadow = true;
		m.receiveShadow = true;
		this.mesh.add(m);
	}
};
