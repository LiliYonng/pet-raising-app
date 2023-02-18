<template>
<!-- 设置画布 -->
      <view style="height: 500px; width: 100%;">
          <canvas type="webgl" id="webgl" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel" @longtap="longTap" @tap="tap"></canvas>
      </view>
</canvas>
				
</template>

<!-- 只能在微信小程序端运行 -->
<script>
	// 引入文件夹

	// 引入文件
        import * as THREE from '../libs/three.weapp.js'
	 import gLTF from '../jsm/loaders/GLTFLoader.js'


	let app = getApp();

	let canvaWidth = 0; //画布宽
	let canvaHeight = 0; //画布高
	let canvas;
	let camera, scene, renderer, model; //定义变量： 摄像机(camera) 场景(scene) 渲染器(renderer) 模型(model)
	let pagestatus = 0; //函数返回
	

	export default {

		data() {
			return {

			}
		},
		onLoad() {

		},
		onReady() {

			//在小程序使用
			// #ifndef   APP||H5 
			//获取webgl
			this.createSelectorQuery().select('#webgl').node().exec((res) => {
				canvas = THREE.global.registerCanvas(res[0].node)

				canvaWidth = 600;
				canvaHeight = 400;
				this.initCanva(canvas);
			})
			// #endif 

		},
		methods: {

			/**
			 * 3d 初始化
			 * @param {*} canvas 
			 */
			initCanva: function(canvas) {
                              const fov = 45;
              const aspect = 2;  // the canvas default
              const near = 0.1;
              const far = 100;
              camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
              camera.position.set(0, 10, 20);
				let that = this;
				//scene
				scene = new THREE.Scene();
                scene.background = new THREE.Color('#DEFEFF');
                const planeSize = 40;
              const tloader = new THREE.TextureLoader();
              const texture = tloader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.magFilter = THREE.NearestFilter;
              const repeats = planeSize / 2;
              texture.repeat.set(repeats, repeats);

              const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
              const planeMat = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
              });
              const mesh = new THREE.Mesh(planeGeo, planeMat);
              mesh.rotation.x = Math.PI * -.5;
              // mesh.rotation.y = Math.PI/2;
              scene.add(mesh);
              const skyColor = 0xB1E1FF;  // light blue
              const groundColor = 0xB97A20;  // brownish orange
              const intensity = 1;
              const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
              scene.add(light);
              const color = 0xFFFFFF;
              const slight = new THREE.DirectionalLight(color, 1);
              slight.castShadow = true;
              slight.position.set(-250, 800, -850);
              slight.target.position.set(-550, 40, -450);

              slight.shadow.bias = -0.004;
              slight.shadow.mapSize.width = 2048;
              slight.shadow.mapSize.height = 2048;

              scene.add(slight);
              scene.add(slight.target);
              const cam = slight.shadow.camera;
              cam.near = 1;
              cam.far = 2000;
              cam.left = -1500;
              cam.right = 1500;
              cam.top = 1500;
              cam.bottom = -1500;

              const cameraHelper = new THREE.CameraHelper(cam);
              scene.add(cameraHelper);
              cameraHelper.visible = false;
              const helper = new THREE.DirectionalLightHelper(slight, 100);
              scene.add(helper);
              helper.visible = false;
              function updateCamera() {
                // update the light target's matrixWorld because it's needed by the helper
                slight.updateMatrixWorld();
                slight.target.updateMatrixWorld();
                helper.update();
                // update the light's shadow camera's projection matrix
                slight.shadow.camera.updateProjectionMatrix();
                // and now update the camera helper we're using to show the light's shadow camera
                cameraHelper.update();
              }

				// 导入3d模型  
                let GLTFLoader = gLTF(THREE);
                const loader = new GLTFLoader();
                console.log('大大撒')
				// let loader = new THREE.GLTFLoader(); //badminton.zip 
				loader.load('http://localhost:8080/model/dog-2/scene.gltf',function(gltf) {
                        console.log('hello')
						model = gltf.scene;
                        console.log(model)
						scene.add(model);
                        console.log(scene)
					model.updateMatrixWorld();
                    const box = new THREE.Box3().setFromObject(model);
                    const boxSize = box.getSize(new THREE.Vector3()).length();
                    const boxCenter = box.getCenter(new THREE.Vector3());

                    // set the camera to frame the box
                    that.frameArea(boxSize * 0.5, boxSize, boxCenter, camera);
					},
					function() {
						return pagestatus;
					},
					undefined,
					function(e) {
						console.error("加载模型出错：", e);
					});


				//render 渲染
				renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				renderer.setPixelRatio(2);
				renderer.setSize(canvas.width, canvas.height);
            
				that.animate();//画布渲染
			},

			// 画布渲染
            frameArea:function(sizeToFitOnScreen, boxSize, boxCenter, camera) {
            const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.8;
            const halfFovY = THREE.Math.degToRad(camera.fov * .5);
            const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
            // compute a unit vector that points in the direction the camera is now
            // in the xz plane from the center of the box
            const direction = (new THREE.Vector3())
              .subVectors(camera.position, boxCenter)
              .multiply(new THREE.Vector3(1, 0, 1))
              .normalize();

            // move the camera to a position distance units way from the center
            // in whatever direction the camera was from the center already
            camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

            // pick some near and far values for the frustum that
            // will contain the box.
            camera.near = boxSize / 100;
            camera.far = boxSize * 100;

            camera.updateProjectionMatrix();
            boxCenter.y+=1;
            boxCenter.z+=1;
            // point the camera to look at the center of the box
            camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
          },
			animate: function() {
				let that = this;
					if (renderer !== null && scene !== null && camera !== null) {
						
						canvas.requestAnimationFrame(that.animate);
						renderer.render(scene, camera);
					}
			},

		}
	}
</script>

