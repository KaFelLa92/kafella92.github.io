    const box = document.getElementById('aboutFloatBox');

    document.addEventListener('mousemove', (e) => {
      const boxRect = box.getBoundingClientRect();
      const boxX = boxRect.left + boxRect.width / 2;
      const boxY = boxRect.top + boxRect.height / 2;

      const dx = e.clientX - boxX;
      const dy = e.clientY - boxY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxDistance = 150; // 반응 시작 범위
      const maxOffset = 40; // 최대 밀림 거리

      if (distance < maxDistance) {
        const factor = (maxDistance - distance) / maxDistance;
        const offsetX = -dx * factor * 0.2;
        const offsetY = -dy * factor * 0.2;
        box.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      } else {
        box.style.transform = `translate(-50%, -50%)`;
      }
    });