<template>
    <canvas type="webgl" id="canvasDom" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel" @longtap="longTap" @tap="tap"></canvas>
</template>
<script>    
    import * as THREE from '../libs/three.weapp.js'
    import gLTF from '../jsm/loaders/GLTFLoader.js'
    import OBJLoader from '../jsm/loaders/OBJLoader.js'
    // import loadgLTF from '../utils/loadgLTF.js'
    import { OrbitControls } from '../jsm/controls/OrbitControls'
    import getSkeletonUtils from "../jsm/utils/SkeletonUtils"
    let composer = null;
    let window = THREE.global;
    let { document } = window;
    let scene;
    let camera;
    let time;
    let canvas;
    let renderer;
    let raycaster;
    let projector;
    let lastChange;
    let progress = 0;
    let clock;
    let mixers;
    let animationId= null;
    let defalutAction=null;
    let defaultMixer = null;
    export default {
        data() {
            return {
              mouse:{},
              controls:null,
              model:{},
              animationName:"sitting",
            }
        },
        mounted(){
            const me =this;
            this.createSelectorQuery()
              .select('#canvasDom')
              .node()
              .exec((res) => {
                canvas = THREE.global.registerCanvas(res[0].node)
                me.init(canvas)
                me.render()
                // canvas.requestAnimationFrame(me.render.bind(me));
              })
        },
        methods: {
          //模型相关
          init(canvas){ //初始化加载器，相机，灯光
              // projector = new THREE.Projector();
              lastChange = {model:null,color:null};
              renderer = new THREE.WebGLRenderer({ canvas });
              raycaster = new THREE.Raycaster();
              renderer.shadowMap.enabled = true;
              clock = new THREE.Clock();;
              const fov = 45;
              const aspect = 1;  // the canvas default
              const near = 0.1;
              const far = 100;
              camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
              camera.position.set(0, 10, 20);
              this.controls = new OrbitControls(camera, canvas);
              this.controls.target.set(0, 5, 0);
              this.controls.update();
              scene = new THREE.Scene();
              scene.background = new THREE.Color('#DEFEFF');

            {
              const skyColor = 0xFFFFFF;  // light blue
              const groundColor = 0xFFFFFF;  // brownish orange
              const intensity = 1;
              const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
              scene.add(light);
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

              scene.add(light);
              scene.add(light.target);
              const cam = light.shadow.camera;
              cam.near = 1;
              cam.far = 2000;
              cam.left = -1500;
              cam.right = 1500;
              cam.top = 1500;
              cam.bottom = -1500;

              const cameraHelper = new THREE.CameraHelper(cam);
              scene.add(cameraHelper);
              cameraHelper.visible = false;
              const helper = new THREE.DirectionalLightHelper(light, 100);
              scene.add(helper);
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
              // this.addCurve();
              this.loadGLTF();
          },
          // 相机调整
          frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
            const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
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
            console.log(camera.position)
            // pick some near and far values for the frustum that
            // will contain the box.
            camera.near = boxSize / 100;
            camera.far = boxSize * 100;
            camera.zoom = 1 
            camera.updateProjectionMatrix();
            boxCenter.y+=0.1;
            // boxCenter.z+=1;
            // point the camera to look at the center of the box
            camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
                          // this.controls.minPolarAngle = 0;
              // this.controls.maxPolarAngle = 0;
              this.controls.minPolarAngle = Math.PI / 2;
              this.controls.maxPolarAngle = Math.PI / 2;

              // 禁止相机俯仰
              this.controls.minAzimuthAngle = -Infinity;
              this.controls.maxAzimuthAngle = Infinity;
              this.controls.update();
          },

        //加载模型 
        loadGLTF(){
            let GLTFLoader = gLTF(THREE);
          const gltfLoader = new GLTFLoader();
          // http://www.l0v0l.xyz/dog-animated/scene.gltf
          console.log('啊哈哈')
          gltfLoader.load('http://localhost:8080/model/dog-2/scene.gltf', (gltf) => {
            console.log(gltf)
            const root = gltf.scene;
            root.name = 'dog'
            this.model.scene = gltf.scene;
            this.model.animations = gltf.animations;
            root.scale.set(5,5,5);
            // scene.add(root);
            this.instantiateUnits(root); //动画
            // scene.add(root);
            root.updateMatrixWorld();
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            this.frameArea(boxSize*0.5, boxSize, boxCenter, camera);
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
          // var clonedScene = SkeletonUtils.clone(this.model.scene);
          // console.log(clonedScene)
          // var clonedMesh = clonedScene.getObjectByName('Object_0');
          // console.log(this.model.animations)
            // Save the animation mixer in the list, will need it in the animation loop
           mixers =  this.startAnimation(null, this.model.animations, this.animationName)
                     scene.add(root);
        // }
        // mixers = new THREE.AnimationMixer(this.model.scene);
        //   var clip = THREE.AnimationClip.findByName(this.model.animations, 'sitting');
        //   if (clip) {
        //       const action = mixers.clipAction(clip);
        //       action.play();
        //   }
        },
        // 渲染
          render() {
                if(animationId){
                  canvas.cancelAnimationFrame(animationId)
                }
                  // time *= 0.001;  // convert to seconds
                if (this.resizeRendererToDisplaySize(renderer)) {
                  const canvas = renderer.domElement;
                  // camera.aspect = canvas.clientWidth / canvas.clientHeight;
                  camera.aspect = 2;
                  camera.updateProjectionMatrix();
                }
                var mixerUpdateDelta = clock.getDelta();
                if(mixers)
                {
                  mixers.update(mixerUpdateDelta);
                }
                renderer.render(scene, camera);
                if(composer)
                {
                  try {
                    composer.render()
                  } catch (error) {
                    console.log('出错啦')
                    console.log(error)
                  }
                }
                animationId = canvas.requestAnimationFrame(this.render);
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
            scene.add(curveObject);
        },
        // 开始动画
        startAnimation(skinnedMesh, animations, animationName) {
          // var mixer = new THREE.AnimationMixer(skinnedMesh);
          if(defalutAction)
            defalutAction.stop()
          const mixer = new THREE.AnimationMixer(this.model.scene);
          var clip = THREE.AnimationClip.findByName(animations, animationName);
          if (clip) {
              defalutAction= mixer.clipAction(clip);
              defalutAction.play();
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
        tap(e){
          console.log('短触碰')
          this.changeAnimation(this.model.animations[ Math.random()%5].name)
          // this.animationName = "play_dead"
          // mixers = this.startAnimation(null, this.model.animations, this.animationName);
        },
        changeAnimation(animationName){
          var clip = THREE.AnimationClip.findByName(this.model.animations, animationName);
          if (clip) {
              const action = mixers.clipAction(clip);
              action.play();
          }
        },
         cancleAnimation() {
          if(animationId)
          canvas.cancelAnimationFrame(animationId)
          //  THREE.global.clearCanvas();
        },
        activeAnimation(){
          this.render()
        }
        // async tap(e) {
        //   console.log('短触2')
        //   const rect = canvas.getBoundingClientRect()
        //   let touch = e.touches[0];
        //   const mouse = new THREE.Vector2();
        //   console.log(touch.clientY)
        //   	//获取 不同系统下、不同手机下的宽和高
        //      let SystemInfoSync = await wx.getSystemInfoSync()
        //   // canvas的width的一半 除以 (canvas的width 除以 系统的windowWidth)
        //     let Cwidth =(rect.width / SystemInfoSync.windowWidth)
        //     // canvas的height的一半 除以 (canvas的height 除以 系统的windowHeight)
        //     let Cheight =(rect.height / SystemInfoSync.windowHeight)
        //      mouse.x = -((touch.clientX ) / rect.width) * 2 + 1;
        //     mouse.y = -((touch.clientY - 100) / rect.height) * 2 + 1;
        //   // mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        //   // mouse.y = -((touch.clientY - rect.top )/ rect.height) * 2 + 1;
        //   raycaster.setFromCamera(mouse, camera);
        //   // create an array containing all objects in the scene with which the ray intersects
        //   // var intersects = raycaster.intersectObjects( scene.children );
        //   let intersects = []
        //   intersects = raycaster.intersectObject(this.model.scene,true);
        //   if (intersects.length>0){
        //     console.log('选中了')
        //     console.log(intersects)
        //       // if (Boolean(lastChange.model)) {
        //       //   lastChange.model.material.emissive.setHex(lastChange.color);
        //       // }
        //         // lastChange.model = intersects[0][0].object
        //         // lastChange.color = intersects[0][0].object.material.emissive.getHex();
        //         console.log(intersects[0].object.name)
        //         console.log(intersects)
        //         // this.outlineObj(intersects[0][0].object,canvas,scene,camera,renderer)
                
        //         intersects[0].object.material.emissive.setHex( Math.random() * 0xffffff );
        //       // else{
        //       //   lastChange.model = null;
        //       //   lastChange.color = null;
        //       // }
        //       // if(progress == 0){
        //       //    this.render();
        //       // }
        //       // intersects[0][0].object.material.color.setRGB(0.2,0.6,0.4);
        //   }
        // },
        
          
        },
    }
</script>
<style lang="scss">
  canvas{
    height:250px;
    width:100%;
  }
</style>