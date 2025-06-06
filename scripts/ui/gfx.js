const canvas = document.getElementById('gfx-canvas');
const ctx = canvas.getContext('2d');

const gfx = {
  show() {
    canvas.style.display = 'block';
    ctx.imageSmoothingEnabled = false;
  },
  hide() {
    canvas.style.display = 'none';
  },
  clear(r=0, g=0, b=0) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  setPixel(x, y, r=255, g=255, b=255) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, 1, 1);
  },
  drawRect(x, y, w, h, r=255, g=255, b=255) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, w, h);
  },
  drawLine(x1, y1, x2, y2, r=255, g=255, b=255) {
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  },
  drawCircle(x, y, radius, r=255, g=255, b=255) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  },
  text(txt, x, y, size=16, r=255, g=255, b=255) {
    ctx.font = `${size}px monospace`;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillText(txt, x, y);
  }
};

window.zeroshellGfx = gfx;
export default gfx;
