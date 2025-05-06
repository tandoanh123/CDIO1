document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));

    // Zoom effect on mouseover
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach(card => {
      card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
      });
      card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
      });
    });
  });