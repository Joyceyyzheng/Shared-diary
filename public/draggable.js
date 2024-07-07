document.addEventListener('DOMContentLoaded', function() {
  const entries = document.querySelectorAll('.entry');

  entries.forEach(entry => {
    entry.draggable = true;
    let offsetX = 0, offsetY = 0, mouseX, mouseY;

    function onMouseMove(event) {
      offsetX = event.clientX - mouseX;
      offsetY = event.clientY - mouseY;
      entry.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    entry.addEventListener('mousedown', function(event) {
      mouseX = event.clientX - offsetX;
      mouseY = event.clientY - offsetY;
      document.addEventListener('mousemove', onMouseMove);
      event.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', onMouseMove);
    });

    entry.addEventListener('dragstart', (event) => {
      event.preventDefault(); // Prevent the default drag action
    });
  });
});