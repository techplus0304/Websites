/* TechPlus Support - Client-side JavaScript Scripts */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navigation Bar
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Navigation Hamburger Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');

      // Transform hamburger to close button (X)
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Active Nav Link Highlighter based on page filename
  const currentPath = window.location.pathname;
  const pageName = currentPath.split("/").pop();
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Testimonials Carousel Slider
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    
    // Create pagination dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));

    const updateDots = (index) => {
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const moveToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots(currentIndex);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
        resetAutoPlay();
      });
    }

    // Auto Play testimonial carousel
    let autoPlayInterval = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 6000);

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
      }, 6000);
    };
  }

  // FAQ Accordion Behavior
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // Animated Stats Counter
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const speed = 200; // lower number = faster speed

    const startCounter = (counter) => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      
      const increment = Math.ceil(target / speed);

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = count + suffix;
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    };

    // Intersection Observer to trigger counters when visible
    const observerOptions = {
      root: null,
      threshold: 0.5, // trigger when 50% of the section is visible
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target); // only count up once
        }
      });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
  }

  // Back to Top Button Interaction
  const scrollTopBtn = document.querySelector('.btn-scrolltop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Contact / Inquiry Form Submission Handling
  const inquiryForm = document.getElementById('inquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.querySelector('.loading-spinner');
  const btnText = document.querySelector('.btn-text');

  if (inquiryForm) {
    // Populate service field if passed in URL query param (e.g. ?service=cybersecurity)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const serviceSelect = document.getElementById('service');
      if (serviceSelect) {
        // Find matching option (case insensitive or exact prefix)
        for (let option of serviceSelect.options) {
          if (option.value.toLowerCase().includes(serviceParam.toLowerCase()) || 
              serviceParam.toLowerCase().includes(option.value.toLowerCase())) {
            option.selected = true;
            break;
          }
        }
      }
    }

    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous error messages from fields
      const errorSpans = inquiryForm.querySelectorAll('.field-error');
      errorSpans.forEach(span => {
        span.textContent = '';
        span.style.display = 'none';
      });
      inquiryForm.querySelectorAll('.form-control').forEach(input => {
        input.removeAttribute('aria-invalid');
      });

      // Clear previous response blocks
      const successDiv = inquiryForm.querySelector('[data-fs-success]');
      const errorDiv = inquiryForm.querySelector('[data-fs-error]');
      if (successDiv) successDiv.style.display = 'none';
      if (errorDiv) errorDiv.style.display = 'none';

      // Perform validation check
      const fullName = document.getElementById('fullName').value.trim();
      const companyName = document.getElementById('companyName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;

      let isValid = true;

      if (!fullName) {
        showFieldError('name', 'Full Name is required.');
        isValid = false;
      }

      if (!email) {
        showFieldError('email', 'Email Address is required.');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      if (!phone) {
        showFieldError('phone', 'Phone Number is required.');
        isValid = false;
      } else if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        showFieldError('phone', 'Please enter a valid phone number (minimum 10 digits).');
        isValid = false;
      }

      if (!service) {
        showFieldError('service', 'Please select a service.');
        isValid = false;
      }

      if (!message) {
        showFieldError('message', 'Message is required.');
        isValid = false;
      }

      if (!isValid) {
        showGeneralError('Please fix the errors below before submitting.');
        return;
      }

      // Show Loading State
      submitBtn.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';
      if (btnText) btnText.textContent = 'Submitting...';

      try {
        const payload = {
          name: fullName,
          companyName: companyName || 'N/A',
          email: email,
          phone: phone,
          service: service,
          message: message
        };

        const response = await fetch('https://formspree.io/f/xzdwqjdb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showSuccessMessage('Your inquiry has been successfully submitted! Our technical team will contact you shortly.');
          inquiryForm.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          let errMsg = 'Form submission failed. Please try again.';
          if (data.errors && data.errors.length > 0) {
            errMsg = data.errors.map(err => err.message).join(', ');
          } else if (data.error) {
            errMsg = data.error;
          }
          showGeneralError(errMsg);
        }
      } catch (err) {
        console.warn('Network request failed. Using LocalStorage fallback...', err);
        
        try {
          const localInquiry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            fullName,
            companyName: companyName || 'N/A',
            email,
            phone,
            service,
            message,
            submittedAt: new Date().toISOString(),
            savedLocally: true
          };

          // Get existing from localStorage
          let localInquiries = [];
          const stored = localStorage.getItem('techplus_inquiries');
          if (stored) {
            localInquiries = JSON.parse(stored);
          }
          localInquiries.push(localInquiry);
          localStorage.setItem('techplus_inquiries', JSON.stringify(localInquiries, null, 2));

          // Log simulated email to console
          console.log('%c📧 [LOCAL FALLBACK] SIMULATED EMAIL TO ADMIN:', 'color: #0078d4; font-weight: bold; font-size: 14px;');
          console.log(
            `========================================================================\n` +
            `NEW INQUIRY RECEIVED - TechPlus Support (Saved Locally in Browser)\n` +
            `Date/Time: ${localInquiry.submittedAt}\n` +
            `Inquiry ID: ${localInquiry.id}\n` +
            `------------------------------------------------------------------------\n` +
            `Customer Name : ${localInquiry.fullName}\n` +
            `Company       : ${localInquiry.companyName}\n` +
            `Email Address : ${localInquiry.email}\n` +
            `Phone Number  : ${localInquiry.phone}\n` +
            `Requested Svc : ${localInquiry.service}\n` +
            `------------------------------------------------------------------------\n` +
            `Message Details:\n${localInquiry.message}\n` +
            `========================================================================`
          );

          // Tell the user explicitly that connection was blocked (likely by an AdBlocker)
          showSuccessMessage('Your inquiry has been saved locally! (Note: The connection to Formspree was blocked. If you are using an AdBlocker, uBlock, or Brave Shields, please disable shielding for this site to test live submissions.)');
          inquiryForm.reset();
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
          showGeneralError('Unable to connect to the server and local storage is disabled.');
        }
      } finally {
        submitBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
        if (btnText) btnText.textContent = 'Submit Inquiry';
      }
    });

    const showFieldError = (fieldName, msg) => {
      const field = inquiryForm.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.setAttribute('aria-invalid', 'true');
      }
      const errorSpan = inquiryForm.querySelector(`[data-fs-error="${fieldName}"]`);
      if (errorSpan) {
        errorSpan.textContent = msg;
        errorSpan.style.display = 'block';
      }
    };

    const showGeneralError = (msg) => {
      const errorDiv = inquiryForm.querySelector('[data-fs-error]');
      if (errorDiv) {
        const textSpan = errorDiv.querySelector('.error-message');
        if (textSpan) textSpan.textContent = msg;
        errorDiv.style.display = 'flex';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    const showSuccessMessage = (msg) => {
      const successDiv = inquiryForm.querySelector('[data-fs-success]');
      if (successDiv) {
        const textSpan = successDiv.querySelector('span');
        if (textSpan) textSpan.textContent = msg;
        successDiv.style.display = 'flex';
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
  }

  // Floating WhatsApp button URL customisation
  const whatsappWidget = document.querySelector('.btn-whatsapp');
  if (whatsappWidget) {
    whatsappWidget.addEventListener('click', () => {
      const phoneNumber = '919702536370'; // Proprietor Contact Number
      const message = encodeURIComponent('Hello TechPlus Support team, I would like to inquire about your IT services.');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    });
  }
});
