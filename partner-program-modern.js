const counters = document.querySelectorAll('[data-counter]');
const modalTriggers = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const modals = {
  apply: document.getElementById('apply-modal'),
  discovery: document.getElementById('discovery-modal'),
};

const animateCounter = (el, target) => {
  const duration = 1400;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target, Number(entry.target.dataset.counter));
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => observer.observe(counter));

const closeAll = () => {
  Object.values(modals).forEach((modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
};

modalTriggers.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = modals[button.dataset.openModal];
    if (!modal) return;
    closeAll();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

closeButtons.forEach((button) => button.addEventListener('click', closeAll));

Object.values(modals).forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeAll();
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAll();
});

const forms = document.querySelectorAll('.modal-form');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    button.textContent = 'Submitted ✓';
    button.disabled = true;
    setTimeout(() => {
      form.reset();
      closeAll();
      button.textContent = original;
      button.disabled = false;
    }, 800);
  });
});
