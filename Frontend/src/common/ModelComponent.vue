<template>
      <view style="height: 500px; width: 100%;">
          <canvas type="webgl" id="canvasDom" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel" @longtap="longTap" bindtap="tap"></canvas>
      </view>
</template>
<script>    
    import * as THREE from '../libs/three.weapp.js'
    import GLTFLoader from '../jsm/loaders/GLTFLoader.js'
    import OBJLoader from '../jsm/loaders/OBJLoader.js'
    import loadgLTF from '../utils/loadgLTF.js'
    let window = THREE.global;
    let { document } = window;
    export default {
        data() {
            return {
              theta:'',
              mouse:'',
              radius:'',
              canvas:'',
              scene:'',
              renderer:'',
              raycaster:'',
              model:'',
              camera:null,
              cube:null,
              scene:null,
              clock:null,
              mixer:null,
            }
        },
        mounted(){
            const me =this;
            this.createSelectorQuery()
              .select('#canvasDom')
              .node()
              .exec((res) => {
                const canvas = THREE.global.registerCanvas(res[0].node)
                loadgLTF(canvas,THREE)
              })
        },
        onUnload() {
          THREE.global.clearCanvas()
        },
        methods: {
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
          // console.log('canvas', e)
        },
        tap(e) {

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