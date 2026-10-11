/**
 * Poonam Khare — Personal Portfolio JavaScript
 * Functions:
 * 1. Mobile menu toggle & accessible focus management
 * 2. Active section scroll spy (IntersectionObserver)
 * 3. Dynamic year display
 * 4. Certificate Lightbox Modal with accessible keyboard handling
 * 5. Honest, transparent contact form action (mailto helper + clear explanation)
 * 6. Graceful image error handler for portrait & certificates
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Dynamic Year in Footer ---
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 2. Sticky Header Elevation on Scroll ---
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- 3. Mobile Navigation Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('open');
    });

    // Close mobile nav when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 4. Scroll Spy: Active Link Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navItems.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --- 5. Portrait Image Fallback Handling ---
  // If the user drops 'portrait.jpg' into assets/, it loads automatically.
  // Otherwise, the fallback placeholder UI remains visible.
  const portraitImg = document.getElementById('hero-portrait-img');
  const portraitPlaceholder = document.getElementById('hero-portrait-placeholder');

  if (portraitImg && portraitPlaceholder) {
    portraitImg.addEventListener('load', () => {
      portraitImg.style.display = 'block';
      portraitPlaceholder.style.display = 'none';
    });
    portraitImg.addEventListener('error', () => {
      portraitImg.style.display = 'none';
      portraitPlaceholder.style.display = 'flex';
    });
  }

  // --- 6. Certificate Lightbox Modal ---
  const certModal = document.getElementById('certificate-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-cert-title');
  const modalIssuer = document.getElementById('modal-cert-issuer');
  const modalDate = document.getElementById('modal-cert-date');
  const modalAwardee = document.getElementById('modal-cert-awardee');
  const modalImg = document.getElementById('modal-cert-img');
  const modalPlaceholder = document.getElementById('modal-cert-placeholder');

  function openCertificateModal(data) {
    if (!certModal) return;

    if (modalTitle) modalTitle.textContent = data.title || 'Certificate';
    if (modalIssuer) modalIssuer.textContent = data.issuer || 'N/A';
    if (modalDate) modalDate.textContent = data.date || 'N/A';
    if (modalAwardee) modalAwardee.textContent = data.awardee || 'Poonam Khare';

    if (data.imageSrc && modalImg) {
      modalImg.src = data.imageSrc;
      modalImg.alt = data.title;
      modalImg.style.display = 'block';
      if (modalPlaceholder) modalPlaceholder.style.display = 'none';

      modalImg.onerror = () => {
        modalImg.style.display = 'none';
        if (modalPlaceholder) modalPlaceholder.style.display = 'flex';
      };
    } else {
      if (modalImg) modalImg.style.display = 'none';
      if (modalPlaceholder) modalPlaceholder.style.display = 'flex';
    }

    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn?.focus();
  }

  function closeCertificateModal() {
    if (!certModal) return;
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach click to certificate view triggers
  document.querySelectorAll('[data-certificate-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.certificate-card');
      if (!card) return;

      const certData = {
        title: card.getAttribute('data-title'),
        issuer: card.getAttribute('data-issuer'),
        date: card.getAttribute('data-date'),
        awardee: card.getAttribute('data-awardee'),
        imageSrc: card.getAttribute('data-image')
      };

      openCertificateModal(certData);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCertificateModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertificateModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('open')) {
        closeCertificateModal();
      }
    });
  }

  // --- 7. Transparent Contact Form Handler ---
  // Explains honestly that this is a client-side portfolio, then generates
  // a clean pre-filled mail draft or displays honest info.
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) {
        formStatus.className = 'form-status-msg info active';
        formStatus.textContent = 'Please fill in your name and message before continuing.';
        return;
      }

      // Generate pre-filled mailto
      const recipient = 'kharepoonam61@gmail.com'; // Editable default or placeholder
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Hello Poonam,\n\n${message}\n\nFrom: ${name}\nEmail: ${email || 'Not provided'}`
      );
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      formStatus.className = 'form-status-msg info active';
      formStatus.innerHTML = `
        <strong>Thank you, ${escapeHtml(name)}!</strong><br>
        This portfolio is client-side only (no hidden backend). We've opened a draft in your email client to reach me directly. 
        You can also reach me directly at <strong>93012 46518</strong> or via <a href="https://www.linkedin.com/in/poonam-khare-348b0b37b" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
      `;

      // Trigger user's mail client
      window.location.href = mailtoUrl;
    });
  }

  // Helper to prevent HTML injection in status message
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
