document.addEventListener('DOMContentLoaded', () => {
    const animation = document.getElementById('github-animation');

    // Initial setup
    animation.stop();
    animation.pause();

    animation.addEventListener('mouseenter', () => {
        animation.play();
    });

    animation.addEventListener('mouseleave', () => {
        animation.stop();
    });
});