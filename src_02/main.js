require('./index.css');
let src = require('../assets/1.png').default;
console.log(src);
let img = new Image();
img.width = 400;
img.height = 500;
img.src = src;
document.body.appendChild(img);