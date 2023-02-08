<template>
      <view style="height: 500px; width: 100%;">
          <canvas type="webgl" id="canvasDom" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel" @longtap="longTap" @tap="tap"></canvas>
      </view>
</template>
<script>    
    import * as THREE from '../libs/three.weapp.js'
    import gLTF from '../jsm/loaders/GLTFLoader.js'
    import OBJLoader from '../jsm/loaders/OBJLoader.js'
    // import loadgLTF from '../utils/loadgLTF.js'
    import { OrbitControls } from '../jsm/controls/OrbitControls'
    import getSkeletonUtils from '../jsm/utils/SkeletonUtils.js';
    let window = THREE.global;
    let { document } = window;
    export default {
        data() {
            return {
              mouse:'',
              canvas:'',
              camera:null,
              renderer:null,
              controls:null,
              clock:null,
              model:{},
              mixers:[],
            }
        },
        mounted(){
            const me =this;
            this.createSelectorQuery()
              .select('#canvasDom')
              .node()
              .exec((res) => {
                console.log('哈哈黑')
                console.log(res)
                const canvas = THREE.global.registerCanvas(res[0].node)
                me.canvas = canvas
                console.log('呵呵黑')
                me.init(me.canvas)
                // me.render()
                canvas.requestAnimationFrame(me.render.bind(me));
              })
        },
        onUnload() {
          THREE.global.clearCanvas()
        },
        methods: {
          //模型相关
          init(canvas){ //初始化加载器，相机，灯光
              this.renderer = new THREE.WebGLRenderer({ canvas });
              this.renderer.shadowMap.enabled = true;
              this.clock = new THREE.Clock();;
              const fov = 45;
              const aspect = 2;  // the canvas default
              const near = 0.1;
              const far = 100;
              this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
              this.camera.position.set(0, 10, 20);
              this.controls = new OrbitControls(this.camera, canvas);
              this.controls.target.set(0, 5, 0);
              this.controls.minPolarAngle = 0;
              this.controls.maxPolarAngle = Math.PI;
              this.controls.update();
              this.scene = new THREE.Scene();
              this.scene.background = new THREE.Color('#DEFEFF');

              // 灯光
                {
              const planeSize = 40;

              const loader = new THREE.TextureLoader();
              const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
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
              this.scene.add(mesh);
            }

            {
              const skyColor = 0xB1E1FF;  // light blue
              const groundColor = 0xB97A20;  // brownish orange
              const intensity = 1;
              const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
              this.scene.add(light);
            }
              const color = 0xFFFFFF;
              const intensity = 1;
              const light = new THREE.DirectionalLight(color, intensity);
              light.castShadow = true;
              light.position.set(-250, 800, -850);
              light.target.position.set(-550, 40, -450);

              light.shadow.bias = -0.004;
              light.shadow.mapSize.width = 2048;
              light.shadow.mapSize.height = 2048;

              this.scene.add(light);
              this.scene.add(light.target);
              const cam = light.shadow.camera;
              cam.near = 1;
              cam.far = 2000;
              cam.left = -1500;
              cam.right = 1500;
              cam.top = 1500;
              cam.bottom = -1500;

              const cameraHelper = new THREE.CameraHelper(cam);
              this.scene.add(cameraHelper);
              cameraHelper.visible = false;
              const helper = new THREE.DirectionalLightHelper(light, 100);
              this.scene.add(helper);
              helper.visible = false;
              function updateCamera() {
                // update the light target's matrixWorld because it's needed by the helper
                light.updateMatrixWorld();
                light.target.updateMatrixWorld();
                helper.update();
                // update the light's shadow camera's projection matrix
                light.shadow.camera.updateProjectionMatrix();
                // and now update the camera helper we're using to show the light's shadow camera
                cameraHelper.update();
              }
              updateCamera();
              this.addCurve();
              this.loadGLTF();
          },
          // 相机调整
          frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
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

        //加载模型 
        loadGLTF(){
            let GLTFLoader = gLTF(THREE);
          const gltfLoader = new GLTFLoader();
          gltfLoader.load('http://localhost:8080/model/dog-2/scene.gltf', (gltf) => {
            const root = gltf.scene;
            this.model.scene = gltf.scene;
            this.model.animations = gltf.animations;
            root.scale.set(10,10,10);
            this.instantiateUnits(root); //动画
            // this.scene.add(root);
            root.traverse((obj) => {
              if (obj.castShadow !== undefined) {
                obj.castShadow = true;
                obj.receiveShadow = true;
              }
            });
            root.updateMatrixWorld();
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            this.frameArea(boxSize * 0.5, boxSize, boxCenter, this.camera);
            this.controls.minDistance = boxSize*1;
            this.controls.maxDistance = boxSize*10;
            this.controls.target.copy(boxCenter);
            this.controls.update();
          }, (e) => {
            console.log('loading')
          });
        },
        // 调整渲染区域
        resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
              renderer.setSize(width, height, false);
            }
            return needResize;
        },
        // 动画
        instantiateUnits(root){
          let { SkeletonUtils } = getSkeletonUtils(THREE);
          var clonedScene = SkeletonUtils.clone(this.model.scene);
          var clonedMesh = clonedScene.getObjectByName('Object_0');
          this.scene.add(root);
          let mixer = this.startAnimation(clonedMesh, this.model.animations, 'standing');
            // Save the animation mixer in the list, will need it in the animation loop
          this.mixers.push(mixer);
            
        // }
        },
        // 渲染
          render(time) {
                  time *= 0.001;  // convert to seconds
                // if (this.resizeRendererToDisplaySize(this.renderer)) {
                //   const canvas = this.renderer.domElement;
                //   // camera.aspect = canvas.clientWidth / canvas.clientHeight;
                //   this.camera.aspect = 1.5;
                //   this.camera.updateProjectionMatrix();
                // }
                var mixerUpdateDelta = this.clock.getDelta();
                if(this.mixers[0])
                {
                  this.mixers[0].update(mixerUpdateDelta);
                }
                const canvas = this.canvas;
                const renderer = this.renderer;
                canvas.requestAnimationFrame(this.render.bind(this));
                renderer.render(this.scene, this.camera);
        },
        addCurve(){
          let curve;
          let curveObject;
          const controlPoints = [
              [1.118281, 5.115846, -3.681386],
              [3.948875, 5.115846, -3.641834],
              [3.960072, 5.115846, -0.240352],
              [3.985447, 5.115846, 4.585005],
              [-3.793631, 5.115846, 4.585006],
              [-3.826839, 5.115846, -14.736200],
              [-14.542292, 5.115846, -14.765865],
              [-14.520929, 5.115846, -3.627002],
              [-5.452815, 5.115846, -3.634418],
              [-5.467251, 5.115846, 4.549161],
              [-13.266233, 5.115846, 4.567083],
              [-13.250067, 5.115846, -13.499271],
              [4.081842, 5.115846, -13.435463],
              [4.125436, 5.115846, -5.334928],
              [-14.521364, 5.115846, -5.239871],
              [-14.510466, 5.115846, 5.486727],
              [5.745666, 5.115846, 5.510492],
              [5.787942, 5.115846, -14.728308],
              [-5.423720, 5.115846, -14.761919],
              [-5.373599, 5.115846, -3.704133],
              [1.004861, 5.115846, -3.641834],
            ];
            const p0 = new THREE.Vector3();
            const p1 = new THREE.Vector3();
            let con = controlPoints.map((p, ndx) => {
              p0.set(...p);
              p1.set(...controlPoints[(ndx + 1) % controlPoints.length]);
              return [
                (new THREE.Vector3()).copy(p0),
                (new THREE.Vector3()).lerpVectors(p0, p1, 0.1),
                (new THREE.Vector3()).lerpVectors(p0, p1, 0.9),
              ];
            });
            curve = new THREE.CatmullRomCurve3(
              [].concat(...con),
              true,
            );
            const points = curve.getPoints(250);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            curveObject = new THREE.Line(geometry, material);
            curveObject.scale.set(100, 100, 100);
            curveObject.position.y = -621;
            curveObject.visible = false;
            this.scene.add(curveObject);
        },
        // 开始动画
        startAnimation(skinnedMesh, animations, animationName) {
          // var mixer = new THREE.AnimationMixer(skinnedMesh);
          const mixer = new THREE.AnimationMixer(this.model.scene);
          var clip = THREE.AnimationClip.findByName(animations, animationName);
          if (clip) {
              var action = mixer.clipAction(clip);
              action.play();
          }
          return mixer;
        },
        touchStart(e) {
          THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
        },
        touchMove(e) {
            THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
          // console.log('canvas', event)
          // let touch = event.touches[0];
          // this.mouse.x = (touch.x / window.innerWidth) * 2 - 1;
          // this.mouse.y = - (touch.y / window.innerHeight) * 2 + 1;
        },
        touchEnd(e) {
          THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
        },
        touchCancel(e) {
          // console.log('canvas', e)
        },
        longTap(e) {
          console.log('长按')
          console.log('canvas', e)
        },
        tap(e) {
          console.log('短触')
          // console.log('canvas', e)
        },
        
          
        },
    }
</script>
<style lang="scss">
  canvas{
    height:250px;
  }
</style>