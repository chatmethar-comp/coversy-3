<template>
    <!-- <div :class='ColorHex ? "bg-white": "bg-black"'> -->
    <div class="h-screen  flex flex-col items-center justify-center gap-1" :class="{ 'text-white' : dark}">
      <div class=" text-2xl flex flex-col items-center text-white absolute z-30 bg-red-400/70 text-bold rounded-lg sm:hidden">
        <span class="material-icons text-8xl">
warning
</span>
<div class="p-2 text-center">Unavaliable on SmartPhone please other devices</div></div>
        <video hidden id="videoInput" width="1200" height="900"></video>
        <div class="w-[400px] h-[400px] overflow-hidden flex justify-center items-center drop-shadow-xl">
          <div v-if="ColorHex===''" @click="handleRandom" class="absolute text-2xl bg-white/50 px-3 py-2 rounded-lg">Tap Somewhere</div>
          <canvas id="canvasOutput" width="640" height="480"></canvas>
        </div>
        <div class="w-full space-y-1">
          <div class="flex justify-between items-center">
            <div class=" flex flex-col">
              <div class="relative">
                <input v-model="title" type="text" class="text-3xl font-bold bg-transparent focus:outline-none" placeholder="Songs Title ♫" />
                <div v-if="title===''&&author===''" class="absolute -left-40 top-3 bg-white text-black px-2 py-1 rounded-lg animate-bounce duration-150">Fill some message! </div>
              </div>
              <input v-model="author" type="text" class="text-xl font-light bg-transparent focus:outline-none" placeholder="Author..." :class="{ 'text-gray-300' : dark, 'text-gray-700':!dark}">
            </div>
            <div @click="favorite=!favorite" >
              <span class="material-icons text-4xl cursor-pointer active:text-red-400 rounded-full p-1">
              {{ favorite ? 'favorite_border' : 'favorite'}}
              </span>
            </div>
          </div>
          <div class="py-2">
            <div class="flex justify-between font-light text-sm">
              <p>{{ Math.floor(((3*60+54)*length/100)/60) }}.{{ Math.floor(((3*60+54)*length/100)%60) }}</p>
              <p>3.54</p>
            </div>
            <div class="relative">
              <div :style="{ width: length+'%'}" class="h-2 z-10 absolute bg-black " :class="{'bg-white' : dark}"></div>
              <div class='h-2  z-0  colored brightness-75'></div>
            </div>


          </div>
          <div class="py-2 flex justify-between items-center">
            <span @click="handleLength" class="material-icons text-4xl">
            shuffle
            </span>
            <span @click="handleRandom" class="material-icons text-4xl cursor-pointer active:text-red-400 duration-200">
            skip_previous
            </span>
            <span @click="play=!play" class="material-icons text-5xl cursor-pointer active:text-red-400 duration-200">{{ play ? 'pause_circle' : 'play_circle' }}</span>
            <span @click="handleRandom" class="material-icons text-4xl cursor-pointer active:text-red-400 duration-200">
            skip_next
            </span>
            <NuxtLink to="/picker" class="material-icons text-4xl">
            loop
            </NuxtLink>
            
          </div>
        </div>
    </div>
    
</template>

<script setup>

const ColorHex = ref('');
const favorite = ref(false);
const play = ref(false);
const length = ref(50);
const title = ref('');
const author = ref('');

const handleLength = () => {
  length.value = Math.floor(Math.random()*100)
}


const handleRandom = () => {
  let canvas = document.getElementById('canvasOutput');
    let ctx = canvas.getContext('2d');
  
  let x = 130 + Math.floor(Math.random() * 390);
  let y = 50 + Math.floor(Math.random() * 390);

  let pixelData = ctx.getImageData(x, y, 1, 1).data;
  let r = pixelData[0];
  let g = pixelData[1];
  let b = pixelData[2];
  
  let color_hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  ColorHex.value = color_hex;
  document.body.style.background = ColorHex.value;
  document.querySelector('.colored').style.background = ColorHex.value;
}

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
    return brightness < 140;
})
</script>

<style  scoped>
</style>