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
              renderer = new THREE.WebGLRenderer({ canvas:canvas,alpha:true});
              raycaster = new THREE.Raycaster();
              renderer.shadowMap.enabled = true;
              renderer.setClearAlpha(0.0);
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
              // scene.background = new THREE.Color('#DEFEFF');

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
              this.addCurve();
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
          // http://localhost:8080/model/dog-2/scene.gltf
          console.log('啊哈哈')
          gltfLoader.load('http://localhost:8080/model/cartoon/caiquan4.gltf', (gltf) => {
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
           const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
            // 设置平面的材质
            const planeMaterial = new THREE.MeshLambertMaterial({
              'color': 0xeeeeee
            })
            // 赋值到Mesh
            const plane = new THREE.Mesh(planeGeometry, planeMaterial)
            // 设置平面位置和旋转
            plane.rotation.x = -0.5 * Math.PI
            plane.position.set(0, 10, 20)
            // 设置地面为投影面
            plane.receiveShadow = true
            // 将平面添加到场景中
            scene.add(plane)
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
        // tap(e){
        //   console.log('短触碰')
        //   this.showRemind = false
        //   this.showBox = false
        //   console.log(this.showRemind)
        //   this.$emit('showText', 1)
        //   // this.changeAnimation(this.model.animations[ Math.random()%5].name)
        //   // this.animationName = "play_dead"
        //   // mixers = this.startAnimation(null, this.model.animations, this.animationName);
          
        // },
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
        },
        async tap(e) {
          const rect = canvas.getBoundingClientRect()
          let touch = e.touches[0];
          const mouse = new THREE.Vector2();
          mouse.x = -((touch.clientX ) / rect.width) * 2 + 1;
          mouse.y = -((touch.clientY+100) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          let intersects = []
          intersects = raycaster.intersectObject(this.model.scene,true);
          if (Boolean(lastChange.model)) {
            lastChange.model.material.emissive.setHex(lastChange.color);
          }
          if (intersects.length>0){ // 选中，记录当前颜色
                lastChange.model = intersects[0].object
                lastChange.color = intersects[0].object.material.emissive.getHex();
                intersects[0].object.material.emissive.setHex(0xffb041); 
                this.$emit('showText', intersects[0].object.name)
          }
          else{ //没选中，清除上次记录
            lastChange.model = null;
            lastChange.color = null;
            this.$emit('showText',0)
          }
        },
        
          
        },
    }
</script>
<style lang="scss">
  canvas{
    height:250px;
    width:100%;
  }

</style>