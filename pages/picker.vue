<template>
    <div class="flex flex-col items-center">
        <header class="text-4xl uppercase font-bold">Color-Picker</header>
        <video hidden id="videoInput" width="720" height="480"></video>
        <div class="relative flex justify-center items-center">
          <div v-if="ColorHex===''" @click="handleRandom" class="absolute text-2xl bg-white/50 px-3 py-2 rounded-lg">Tap Somewhere</div>
            <canvas id="canvasOutput" width="720" height="480" class="p-4"></canvas>
        </div>

        <div v-if="ColorHex" class="w-full grid grid-cols-3 gap-5">
            <div class="bg-white/20 p-3 rounded-md">
                <h2 :class="{'text-white':dark}">Hex</h2>

                    <p class="text-2xl" :class="{'text-white':dark}">{{ ColorHex }}</p>

            </div>
            <div class="bg-white/20 p-3 rounded-md">
                <h2 :class="{'text-white':dark}">RGB</h2>
                <p class="text-2xl" :class="{'text-white':dark}">{{ ColorRGB }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-md">
                <h2 :class="{'text-white':dark}">HSV</h2>
                <p class="text-2xl" :class="{'text-white':dark}">{{ HSV }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-md">
                <h2 :class="{'text-white':dark}">HSL</h2>
                <p class="text-2xl" :class="{'text-white':dark}">{{ HSL }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-md">
                <h2 :class="{'text-white':dark}">CMYK</h2>
                <p class="text-2xl" :class="{'text-white':dark}">{{ CMYK }}</p>
            </div>
            <div class="flex items-center">
                <NuxtLink to="/" class="material-icons ml-8 text-6xl" :class="{ 'text-white' : dark, 'text-gray-800': !dark}">
                    library_music
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const ColorHex = ref('') 
const ColorRGB = ref('')
const HSV = ref('')
const HSL = ref('')
const CMYK = ref('')

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



function rgbtohsv(r, g, b) {
  let r1 = r / 255;
  let g1 = g / 255;
  let b1 = b / 255;

  let max = Math.max(r1, g1, b1);
  let min = Math.min(r1, g1, b1);

  let h, s, v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
      case g1: h = (b1 - r1) / d + 2; break;
      case b1: h = (r1 - g1) / d + 4; break;
    }
    h /= 6;
  }
  
  h = Math.round(h*360);
  s = Math.round(s*100);
  v = Math.round(v*100);
  
  let hsv = `${h}°, ${s}%, ${v}%`;
  return hsv;
}

function rgbtohsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h*360);
  s = Math.round(s*100);
  l = Math.round(l*100);

  let hsl = `${h}°, ${s}%, ${l}%`;
  return hsl;
}

function rgbtocmyk(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let k = 1 - Math.max(r, g, b); 
  let c = (1 - r - k) / (1 - k);
  let m = (1 - g - k) / (1 - k);
  let y = (1 - b - k) / (1 - k);
  if (k == 1) {
    c = 0
    m = 0
    y = 0
  };

  c = Math.round(c*100);
  m = Math.round(m*100);
  y = Math.round(y*100);
  k = Math.round(k*100);
  
  let cmyk = `${c}%, ${m}%, ${y}%, ${k}%`;
  return cmyk;
}




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

  // Use a flag to track if the mouse button is currently pressed down
  let isMouseDown = false;

  // Add event listeners to the canvas
  canvas.addEventListener('mousedown', function(event) {
    // Set the flag to true when the mouse button is pressed down
    isMouseDown = true;
    
    // Call the function to update the color based on the mouse position
    updateColor(event.offsetX, event.offsetY);

  });
  
  canvas.addEventListener('mouseup', function(event) {
    // Set the flag to false when the mouse button is released
    isMouseDown = false;
  });
  
  canvas.addEventListener('mousemove', function(event) {
    // Call the function to update the color based on the mouse position
    if (isMouseDown) {
      updateColor(event.offsetX, event.offsetY);
    } 
  });

  function updateColor(x, y) {
    // Get the pixel data at the specified position
    let pixelData = ctx.getImageData(x, y, 1, 1).data;
    let r = pixelData[0];
    let g = pixelData[1];
    let b = pixelData[2];

    // Calculate the color codes for the selected color
    let color_hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    ColorHex.value = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    let color_rgb = `${r}, ${g}, ${b}`;
     ColorRGB.value = `${r}, ${g}, ${b}`;
    let hsv = rgbtohsv(r, g, b);
    HSV.value = rgbtohsv(r, g, b);
    let hsl = rgbtohsl(r, g, b);
    HSL.value = rgbtohsl(r, g, b);
    let cmyk = rgbtocmyk(r, g, b);
    CMYK.value = rgbtocmyk(r, g, b);
    
    
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    
    let rr = 255 - r;
    let gg = 255 - g;
    let bb = 255 - b;

    document.querySelector('header').style.color = `rgb(${rr}, ${gg}, ${bb})`;
  }
  
  // Start processing the video
  function processVideo() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.addEventListener('mousedown', function(event) {
      isMouseDown = true;
      updateColor(event.offsetX, event.offsetY);
    });
    setTimeout(processVideo, 0); // Schedule the next frame to be processed
  }

  // Start processing the video
  processVideo();
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

<style scoped>

</style>