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

  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const value = Math.floor(progress * target);

    if (target === 96) {
      el.textContent = `${value}%`;
    } else {
      el.textContent = value.toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.getAttribute('data-counter'));
      animateCounter(el, target);
      obs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => observer.observe(counter));

const closeAllModals = () => {
  Object.values(modals).forEach((modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const type = trigger.getAttribute('data-open-modal');
    const targetModal = modals[type];

    if (!targetModal) return;

    closeAllModals();
    targetModal.classList.add('open');
    targetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

closeButtons.forEach((button) => button.addEventListener('click', closeAllModals));

Object.values(modals).forEach((modal) => {
  if (!modal) return;

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeAllModals();
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAllModals();
});

const forms = document.querySelectorAll('.modal-form');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitted ✓';
    submitButton.disabled = true;

    setTimeout(() => {
      closeAllModals();
      form.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 800);
  });
});

const faqTriggers = document.querySelectorAll('.faq-trigger');
faqTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    faqTriggers.forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
      btn.closest('.faq-item').classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});
