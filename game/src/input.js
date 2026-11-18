export function createInput(canvas) {
  const keys = new Set();
  const pressed = new Set();
  const mouse = { x: 640, y: 360, down: false };

  window.addEventListener('keydown', (event) => {
    keys.add(event.code);
    pressed.add(event.code);
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F2'].includes(event.code)) {
      event.preventDefault();
    }
  });
  window.addEventListener('keyup', (event) => keys.delete(event.code));
  canvas.addEventListener('pointermove', (event) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - bounds.left) * 1280 / bounds.width;
    mouse.y = (event.clientY - bounds.top) * 720 / bounds.height;
  });
  canvas.addEventListener('pointerdown', () => { mouse.down = true; });
  window.addEventListener('pointerup', () => { mouse.down = false; });

  return {
    keys,
    mouse,
    was(code) {
      const wasPressed = pressed.has(code);
      pressed.delete(code);
      return wasPressed;
    },
    clear() { pressed.clear(); }
  };
}
