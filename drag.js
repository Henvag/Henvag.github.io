document.addEventListener('DOMContentLoaded', () => {
    const musicBox = document.querySelector('.music-box');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    musicBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        musicBox.style.transition = 'none';

        const style = window.getComputedStyle(musicBox);
        const transform = new WebKitCSSMatrix(style.transform);

        currentX = transform.m41;
        currentY = transform.m42;

        initialX = e.clientX;
        initialY = e.clientY;

        musicBox.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - initialX;
        const dy = e.clientY - initialY;

        let newX = currentX + dx;
        let newY = currentY + dy;

        musicBox.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        musicBox.style.cursor = 'grab';
        musicBox.style.transition = 'all 0.3s ease';
    });
});