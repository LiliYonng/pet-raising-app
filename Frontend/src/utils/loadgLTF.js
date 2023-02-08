import { OrbitControls } from '../jsm/controls/OrbitControls'
import gLTF from '../jsm/loaders/GLTFLoader.js'
import getSkeletonUtils from '../jsm/utils/SkeletonUtils.js';
export default function (canvas, THREE) {
  let GLTFLoader = gLTF(THREE);
  let { SkeletonUtils } = getSkeletonUtils(THREE);
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.shadowMap.enabled = true;
  let clock = new THREE.Clock();;
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  controls.update();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#DEFEFF');

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
    scene.add(mesh);
  }

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
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

    // function makeXYZGUI(gui, vector3, name, onChangeFn) {
    //   const folder = gui.addFolder(name);
    //   folder.add(vector3, 'x', vector3.x - 500, vector3.x + 500).onChange(onChangeFn);
    //   folder.add(vector3, 'y', vector3.y - 500, vector3.y + 500).onChange(onChangeFn);
    //   folder.add(vector3, 'z', vector3.z - 500, vector3.z + 500).onChange(onChangeFn);
    //   folder.open();
    // }

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

    // class DimensionGUIHelper {
    //   constructor(obj, minProp, maxProp) {
    //     this.obj = obj;
    //     this.minProp = minProp;
    //     this.maxProp = maxProp;
    //   }
    //   get value() {
    //     return this.obj[this.maxProp] * 2;
    //   }
    //   set value(v) {
    //     this.obj[this.maxProp] = v / 2;
    //     this.obj[this.minProp] = v / -2;
    //   }
    // }

    // class MinMaxGUIHelper {
    //   constructor(obj, minProp, maxProp, minDif) {
    //     this.obj = obj;
    //     this.minProp = minProp;
    //     this.maxProp = maxProp;
    //     this.minDif = minDif;
    //   }
    //   get min() {
    //     return this.obj[this.minProp];
    //   }
    //   set min(v) {
    //     this.obj[this.minProp] = v;
    //     this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    //   }
    //   get max() {
    //     return this.obj[this.maxProp];
    //   }
    //   set max(v) {
    //     this.obj[this.maxProp] = v;
    //     this.min = this.min;  // this will call the min setter
    //   }
    // }

    // class VisibleGUIHelper {
    //   constructor(...objects) {
    //     this.objects = [...objects];
    //   }
    //   get value() {
    //     return this.objects[0].visible;
    //   }
    //   set value(v) {
    //     this.objects.forEach((obj) => {
    //       obj.visible = v;
    //     });
    //   }
    // }

    // const gui = new GUI();
    // gui.close();
    // gui.add(new VisibleGUIHelper(helper, cameraHelper), 'value').name('show helpers');
    // gui.add(light.shadow, 'bias', -0.1, 0.1, 0.001);
    // {
    //   const folder = gui.addFolder('Shadow Camera');
    //   folder.open();
    //   folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 4000)
    //     .name('width')
    //     .onChange(updateCamera);
    //   folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 4000)
    //     .name('height')
    //     .onChange(updateCamera);
    //   const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1);
    //   folder.add(minMaxGUIHelper, 'min', 1, 1000, 1).name('near').onChange(updateCamera);
    //   folder.add(minMaxGUIHelper, 'max', 1, 4000, 1).name('far').onChange(updateCamera);
    //   folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera);
    // }

    // makeXYZGUI(gui, light.position, 'position', updateCamera);
    // makeXYZGUI(gui, light.target.position, 'target', updateCamera);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
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
    // boxCenter.x = boxCenter.x*0.5
    // boxCenter.y = boxCenter.y
    // boxCenter.z=boxCenter.z*0.5

    console.log(boxCenter)
    boxCenter.y+=1;
    boxCenter.z+=1;
    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  let curve;
  let curveObject;
  {
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
    {
      const points = curve.getPoints(250);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      curveObject = new THREE.Line(geometry, material);
      curveObject.scale.set(100, 100, 100);
      curveObject.position.y = -621;
      curveObject.visible = false;
      scene.add(curveObject);
    }
  }

  let model = {};
  loadModel();
  function loadModel() {
    const gltfLoader = new GLTFLoader();
    console.log('嘻嘻嘻嘻嘻')
    gltfLoader.load('http://localhost:8080/model/dog-2/scene.gltf', (gltf) => {
      console.log('哈哈哈哈哈啊哈')
      console.log(gltf)
      const root = gltf.scene;
      console.log('啦啦啦');
      model.scene = gltf.scene;
      model.animations = gltf.animations;
      root.scale.set(10,10,10);
      console.log('尽量加快了')
      // root.rotateX (Math.PI/2)
      // root.rotateY (Math.PI)
      instantiateUnits(root);
      console.log('添加成功')
      console.log(scene)
      // scene.add(root);
      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      // const loadedCars = root.getObjectByName('Cars');
      const fixes = [
        { prefix: 'Car_08', y: 0, rot: [Math.PI * .5, 0, Math.PI * .5], },
        { prefix: 'CAR_03', y: 33, rot: [0, Math.PI, 0], },
        { prefix: 'Car_04', y: 40, rot: [0, Math.PI, 0], },
      ];

      root.updateMatrixWorld();
      // for (const car of loadedCars.children.slice()) {
      //   const fix = fixes.find(fix => car.name.startsWith(fix.prefix));
      //   const obj = new THREE.Object3D();
      //   car.position.set(0, fix.y, 0);
      //   car.rotation.set(...fix.rot);
      //   obj.add(car);
      //   scene.add(obj);
      //   cars.push(obj);
      // }

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      // controls.maxDistance = boxSize * 10;
      controls.minDistance = boxSize*1;
      controls.maxDistance = boxSize*10;
      // boxCenter.x = boxCenter.x - 50;
      // boxCenter.y-=50;
      // boxCenter.z -=50;
      console.log(boxCenter)
      controls.target.copy(boxCenter);
      // controls.target.set(boxCenter.x-50,boxCenter-50,boxCenter-50)
      controls.update();
    }, (e) => {
      console.log('loading')
    });
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // create 2 Vector3s we can use for path calculations
  const carPosition = new THREE.Vector3();
  const carTarget = new THREE.Vector3();

  function render(time) {
    time *= 0.001;  // convert to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      // camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = 1.5;
      camera.updateProjectionMatrix();
    }

    {
      const pathTime = time * .01;
      const targetOffset = 0.01;
      // cars.forEach((car, ndx) => {
      //   // a number between 0 and 1 to evenly space the cars
      //   const u = pathTime + ndx / cars.length;

      //   // get the first point
      //   curve.getPointAt(u % 1, carPosition);
      //   carPosition.applyMatrix4(curveObject.matrixWorld);

      //   // get a second point slightly further down the curve
      //   curve.getPointAt((u + targetOffset) % 1, carTarget);
      //   carTarget.applyMatrix4(curveObject.matrixWorld);

      //   // put the car at the first point (temporarily)
      //   car.position.copy(carPosition);
      //   // point the car the second point
      //   car.lookAt(carTarget);

      //   // put the car between the 2 points
      //   car.position.lerpVectors(carPosition, carTarget, 0.5);
      // });
    }
    var mixerUpdateDelta = clock.getDelta();
    if(mixers[0])
    {
      mixers[0].update(mixerUpdateDelta);
    }
    renderer.render(scene, camera);

    canvas.requestAnimationFrame(render);
  }
  const mixers = [];
  function instantiateUnits(root){
    var clonedScene = SkeletonUtils.clone(model.scene);
    console.log('手机掉')
    var clonedMesh = clonedScene.getObjectByName('Object_0');
    console.log(clonedMesh)
    // if (clonedMesh) {
    console.log(model.animations)
    scene.add(root);
       let mixer = startAnimation(clonedMesh, model.animations, 'standing');

      // Save the animation mixer in the list, will need it in the animation loop
      mixers.push(mixer);
      
  // }
  }
  function startAnimation(skinnedMesh, animations, animationName) {
    console.log('开始动画啦')
    // var mixer = new THREE.AnimationMixer(skinnedMesh);
    const mixer = new THREE.AnimationMixer(model.scene);
    var clip = THREE.AnimationClip.findByName(animations, animationName);
    if (clip) {

        var action = mixer.clipAction(clip);
        action.play();
        console.log('开始播放')
    }

    return mixer;

  }
  canvas.requestAnimationFrame(render);
}