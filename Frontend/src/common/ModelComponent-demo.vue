<template>
      <view style="height: 100%; width: 100%;">
          <canvas type="webgl" id="webgl" bindtouchstart="touchStart" bindtouchmove="touchMove" bindtouchend="touchEnd" bindtouchcancel="touchCancel" bindlongtap="longTap" bindtap="tap"></canvas>
      </view>
</template>
<script>
	import * as THREE from 'three-platformize';
	import { WechatPlatform } from '../WechatPlatform';
	// import { OBJLoader } from 'three-platformize/examples/jsm/loaders/OBJLoader';
	import { GLTFLoader } from '../jsm/GLTFLoader';
	import {OrbitControls} from '../jsm/OrbitControls';
	export default {
		data() {
			return {
				canvas:null,
				camera:null,
				scene:null,
				renderer:null,
				model:null,
				controls:null,
				loopIndex:null
			}
		},
		onLoad() {

		},
		methods: {
			async init() { 
				const { canvas }= await this.getCanvas();
				this.canvas = canvas;
				const platform = new WechatPlatform(canvas); // webgl canvas
				platform.enableDeviceOrientation('game'); // 开启DeviceOrientation
				THREE.PLATFORM.set(platform);
				this.platform = platform;
				this.renderModel();
		    },
			//获取画布
			async getCanvas(delay = 200) {
			  return new Promise((resolve, reject) => {
				const t = setTimeout(() => {
				  clearTimeout(t);
				  uni.createSelectorQuery().in(this)
					.select('#webgl')
					.fields({ node: true })
					.exec((res) => {
						console.log('res',res)
					  if (res && res[0] && res[0].node) {
						const canvas = res[0].node;
						resolve({ canvas });
					  } else {
						reject("获取canvas失败");
					  }
					});
				}, delay);
			  });
			},
			renderModel () {
				this.camera = new THREE.PerspectiveCamera(45, this.canvas.width / this.canvas.height, 0.25, 100);
				this.camera.position.set(- 5, 3, 10);
				this.camera.lookAt(new THREE.Vector3(0, 2, 0));
				this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color(0xe0e0e0);
				this.scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
				this.clock = new THREE.Clock();
				// lights
				var light = new THREE.HemisphereLight(0xffffff, 0x444444);
				light.position.set(0, 20, 0);
				this.scene.add(light);
				// 改变外壳颜色
				var AmbientLight = new THREE.AmbientLight(0x815800); // 环境光
				this.scene.add(AmbientLight);
				// 平行光
				light = new THREE.DirectionalLight(0xffffff);
				light.position.set(0, 20, 10);
				this.scene.add(light);
				// // ground
				// var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
				// mesh.rotation.x = - Math.PI / 2;
				// this.scene.add(mesh);
				// var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
				// grid.material.opacity = 0.6;
				// grid.material.transparent = true;
				// this.scene.add(grid);

				// OBJ model
				// var loader = new OBJLoader();
				// loader.load('http://localhost:8888/obj3/file.obj', (obj) => {
				// 	console.log("obj+=")
				// 	console.log(obj)
				// 	// console.log(this.model)
				// 	obj.position.set(0, -2, 0);//模型摆放的位置
				// 	obj.scale.set(0.2, 0.2, 0.2);
				// 	// this.model = obj;
				// 	this.scene.add(obj);
				// }, undefined, function (e) {
				// 	console.log("模型加载错误")
				// 	console.error(e);
				// });

        //GLTF model
				var loader = new GLTFLoader();
					loader.load('http://localhost:8080/images/model2.gltf', (gltf) => {
						this.model = gltf.scene;
						this.scene.add(this.model);
					}, undefined, function (e) {
						console.error(e);
		        });
				// var geometry = new THREE.BoxGeometry( 5, 5, 5 );
				// var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
				// var mesh = new THREE.Mesh( geometry, material );
				// this.scene.add(mesh);
		
				this.renderer = new THREE.WebGLRenderer({antialias: true });
				this.renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
				this.renderer.setSize(this.canvas.width, this.canvas.height);
				//this.renderer.outputEncoding = true;
				this.renderer.gammaFactor = 2.2;
		
				this.controls = new OrbitControls(this.camera, this.renderer.domElement );
				this.camera.position.set( 5, 5, 10 );
				this.animate();
			},
		animate() {
		        this.loopIndex = this.canvas.requestAnimationFrame(this.animate);
		        this.renderer.render(this.scene, this.camera);
		        this.controls.update();
		    },
		
		    touchStart(e) {
		        this.platform.dispatchTouchEvent(e);
		    },
		    touchMove(e) {
		        this.platform.dispatchTouchEvent(e);
		    },
		    touchEnd(e) {
		        this.platform.dispatchTouchEvent(e);
		    }
		},
		mounted() {
			this.$nextTick(()=>  {
			      this.init();
			    });
		}
	}
</script>
