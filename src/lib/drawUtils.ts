export const drawStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  inset: number,
  fill: string
) => {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0 - radius);
  for (let i = 0; i < 5; i++) {
    ctx.rotate(Math.PI / 5);
    ctx.lineTo(0, 0 - radius * inset);
    ctx.rotate(Math.PI / 5);
    ctx.lineTo(0, 0 - radius);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  // Add a subtle glow/stroke
  ctx.strokeStyle = "#eab308"; // darker yellow
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
};
