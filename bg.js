const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize(){ 
  w = canvas.width = window.innerWidth; 
  h = canvas.height = window.innerHeight; 
}
window.addEventListener('resize', resize);
resize();

// particles
const particles = [];
for(let i = 0; i < 80; i++){
  particles.push({
    x: Math.random()*w,
    y: Math.random()*h,
    r: Math.random()*3 + 1,
    dx: (Math.random()-0.5)*1.5,
    dy: (Math.random()-0.5)*1.5,
    alpha: Math.random()*0.5 + 0.2
  });
}

// track mouse
let mouse = {x: w/2, y: h/2};
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// animate
function animate(){
  ctx.clearRect(0,0,w,h);
  
  // draw particles
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    // bounce
    if(p.x<0||p.x>w)p.dx*=-1;
    if(p.y<0||p.y>h)p.dy*=-1;

    // draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,255,245,${p.alpha})`;
    ctx.fill();

    // draw line to mouse 
    const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
    if(dist < 120){
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(0,255,245,${0.3 - dist/400})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });

  requestAnimationFrame(animate);
}
animate();
const trail = document.querySelector('body::after');
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--mouseX', `${e.clientX}px`);
  document.body.style.setProperty('--mouseY', `${e.clientY}px`);
});
