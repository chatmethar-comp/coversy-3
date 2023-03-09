<template>
    <!-- <div :class='ColorHex ? "bg-white": "bg-black"'> -->
    <div class="h-screen flex flex-col items-center justify-center gap-1" :class="{ 'text-white' : dark}">
        <video hidden id="videoInput" width="1200" height="900"></video>
        <div class="w-[400px] h-[400px] overflow-hidden flex justify-center items-center drop-shadow-xl">
          <canvas id="canvasOutput" width="640" height="480"></canvas>
        </div>
        <div class="w-full space-y-1">
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
              <input type="text" class="text-3xl font-bold bg-transparent focus:outline-none" placeholder="Songs ♫" />
              <input type="text" class="text-xl font-light bg-transparent focus:outline-none" placeholder="Author..." :class="{ 'text-gray-300' : dark, 'text-gray-700':!dark}">
            </div>
            <div @click="favorite=!favorite">
              <span class="material-icons text-4xl">
              {{ favorite ? 'favorite_border' : 'favorite'}}
              </span>
            </div>
          </div>
          <div class="py-2">
            <div class="flex justify-between font-light text-sm">
              <p>1.27</p>
              <p>3.54</p>
            </div>
            <div class="relative">
              <div class="h-2 w-1/2 z-10 absolute bg-black " :class="{'bg-white' : dark}"></div>
              <div class='h-2  z-0  colored brightness-75'></div>
            </div>


          </div>
          <div class="py-2 flex justify-between items-center">
            <span class="material-icons text-4xl">
            shuffle
            </span>
            <span class="material-icons text-4xl">
            skip_previous
            </span>
            <span @click="play=!play" class="material-icons text-5xl">{{ play ? 'pause_circle' : 'play_circle' }}</span>
            <span class="material-icons text-4xl">
            skip_next
            </span>
            <span class="material-icons text-4xl">
            loop
            </span>
          </div>
        </div>        
    </div>
    
</template>

<script setup>


const ColorHex = ref('');
const favorite = ref(false);
const play = ref(false);

onMounted(()=>{
    let video = document.getElementById('videoInput');
    let canvas = document.getElementById('canvasOutput');
    let ctx = canvas.getContext('2d');

    
    function onOpenCvReady() {
      // Set up the video stream
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(stream => {
          video.srcObject = stream;
          video.play();
        })
        .catch(err => {
          console.error('Could not access camera: ' + err);
        });
      // Set up the mouse callback function for the canvas
      canvas.addEventListener('click', function(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixelData = ctx.getImageData(x, y, 1, 1).data;
        let r = pixelData[0];
        let g = pixelData[1];
        let b = pixelData[2];
        let color_hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        ColorHex.value = color_hex;

        document.body.style.background = ColorHex.value;
        document.querySelector('.colored').style.background = ColorHex.value;
      });
    
      // Start processing the video
      setInterval(function() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }, 20);
    }
    
    onOpenCvReady();
  })
  
const dark = computed(() => {
      const hex = ColorHex.value.replace('#', '');
      const c_r = parseInt(hex.substring(0, 0 + 2), 16);
      const c_g = parseInt(hex.substring(2, 2 + 2), 16);
      const c_b = parseInt(hex.substring(4, 4 + 2), 16);
      const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
      return brightness < 120;
})
</script>

<style  scoped>
</style>