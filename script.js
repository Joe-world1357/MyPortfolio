// Register Service Worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update theme toggle icon
function updateThemeIcon() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const icon = themeToggle.querySelector('i');
  if (currentTheme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// Initialize theme icon
updateThemeIcon();

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
  
  // Add a subtle animation to the toggle button
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 150);
});

// Mobile Navigation Toggle with improved experience
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  
  // Prevent body scrolling when menu is open
  if (navMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Close mobile menu when clicking on a link or outside the menu
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('active')) {
    if (!navMenu.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  document.body.style.overflow = '';
}));

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Enhanced scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// Detect device type for performance optimizations
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Apply performance optimizations for mobile
if (isMobile) {
  // Reduce animation complexity on mobile
  document.documentElement.classList.add('mobile-device');
  
  // Use passive event listeners for better scroll performance
  document.addEventListener('touchstart', function() {}, { passive: true });
  
  // Optimize intersection observer threshold for mobile
  observerOptions.threshold = 0.05;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      
      // Add staggered animation for skill items
      if (entry.target.classList.contains('skill-category')) {
        const skillItems = entry.target.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.animation = 'fadeInUp 0.6s ease forwards';
            
            // Animate skill progress bars
            const progressBar = item.querySelector('.skill-progress');
            if (progressBar) {
              const width = progressBar.getAttribute('data-width');
              setTimeout(() => {
                progressBar.style.width = width;
              }, 300);
            }
          }, index * 100);
        });
      }
    }
  });
}, observerOptions);

// Observe all elements with animation class
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.skill-category, .project-card, .stat, .about-text, .contact-info, .contact-form');
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
});

// Enhanced contact form handling with EmailJS
const contactForm = document.getElementById('contact-form');
const formResponse = document.getElementById('form-response');
const submitBtn = document.getElementById('submit-btn');

// Initialize EmailJS
(function() {
  // IMPORTANT: Replace these values with your actual EmailJS credentials
  // Sign up at https://www.emailjs.com/ to get your credentials
  emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
})();

// Form validation
function validateInput(input, validationDiv) {
  if (input.value.trim() === '') {
    input.parentElement.classList.add('error');
    validationDiv.textContent = `${input.placeholder} is required`;
    return false;
  }
  
  if (input.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      input.parentElement.classList.add('error');
      validationDiv.textContent = 'Please enter a valid email address';
      return false;
    }
  }
  
  input.parentElement.classList.remove('error');
  input.parentElement.classList.add('success');
  validationDiv.textContent = '';
  return true;
}

// Form submission
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Reset form response
  formResponse.className = 'form-response';
  formResponse.textContent = '';
  formResponse.style.display = 'none';
  
  // Get form inputs
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  
  // Validate inputs
  const nameValidation = validateInput(nameInput, nameInput.nextElementSibling);
  const emailValidation = validateInput(emailInput, emailInput.nextElementSibling);
  const subjectValidation = validateInput(subjectInput, subjectInput.nextElementSibling);
  const messageValidation = validateInput(messageInput, messageInput.nextElementSibling);
  
  // If validation fails, stop form submission
  if (!nameValidation || !emailValidation || !subjectValidation || !messageValidation) {
    return;
  }
  
  // Show loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Prepare template parameters
  const templateParams = {
    user_name: nameInput.value,
    user_email: emailInput.value,
    subject: subjectInput.value,
    message: messageInput.value
  };
  
  // Send email using EmailJS
  emailjs.send('service_htfyhld', 'YOUR_TEMPLATE_ID', templateParams) // Replace with your actual service and template IDs
    .then(function(response) {
      // Show success message
      formResponse.textContent = 'Thank you for your message! I\'ll get back to you soon.';
      formResponse.classList.add('success');
      formResponse.style.display = 'block';
      
      // Reset form
      contactForm.reset();
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('success');
      });
      
      // Reset button
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    })
    .catch(function(error) {
      // Show error message
      formResponse.textContent = 'Oops! There was a problem sending your message. Please try again later.';
      formResponse.classList.add('error');
      formResponse.style.display = 'block';
      
      // Reset button
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      
      console.error('EmailJS error:', error);
    });
});

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Set background color based on type
  switch(type) {
    case 'success':
      notification.style.background = 'var(--secondary-color)';
      break;
    case 'error':
      notification.style.background = '#ef4444';
      break;
    default:
      notification.style.background = 'var(--primary-color)';
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Enhanced typing animation for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Add cursor blink effect
      element.innerHTML += '<span class="cursor">|</span>';
      const cursor = element.querySelector('.cursor');
      if (cursor) {
        setInterval(() => {
          cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
      }
    }
  }
  
  type();
}

// Project Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalBody = document.querySelector('.modal-body');
  const viewDetailsButtons = document.querySelectorAll('.view-details');

  // Project data
  const projectsData = {
    'university-system': {
      title: 'University Management System',
      description: `
        <p>The University Management System is a comprehensive web application designed to streamline academic administration through three specialized portals for students, professors, and administrators.</p>
        <p>The system features a modern, responsive interface with smooth animations and transitions that enhance user experience. Each portal offers role-specific functionality including course management, grade tracking, assignment submission, attendance tracking, and administrative controls.</p>
        <p>The project implements a modular design approach with careful attention to UI/UX principles, featuring custom animations, interactive dashboards, and a cohesive design system with academic-themed color schemes and typography.</p>
      `,
      gallery: [
        'https://via.placeholder.com/600x400?text=Student+Portal+Dashboard',
        'https://via.placeholder.com/600x400?text=Professor+Portal',
        'https://via.placeholder.com/600x400?text=Admin+Interface'
      ],
      specs: {
        'Frontend': 'HTML5, CSS3, JavaScript (Vanilla)',
        'UI/UX': 'Custom animations, responsive design, dashboard interfaces',
        'Architecture': 'Module-based design with role-specific portals',
        'Features': 'Course management, grade tracking, user administration, reporting',
        'Design System': 'Academic color palette with consistent typography and components'
      },
      demoLink: '#',
      codeLink: '#'
    },
    'advanced-oop': {
      title: 'Airport Management System',
      description: `
        <p>This comprehensive Airport Management System is built using Java and JavaFX, implementing advanced object-oriented programming principles to create a powerful, feature-rich desktop application.</p>
        <p>The system features modules for flight operations management, passenger processing, security systems, ground handling operations, and terminal management. It follows the MVC architecture pattern with a sophisticated purple-themed UI design for optimal user experience.</p>
        <p>Key features include flight scheduling with real-time tracking, gate assignment algorithms, security clearance management, role-based access control, and comprehensive reporting/analytics capabilities.</p>
      `,
      gallery: [
        'https://via.placeholder.com/600x400?text=Application+Dashboard',
        'https://via.placeholder.com/600x400?text=User+Management+Screen',
        'https://via.placeholder.com/600x400?text=Data+Visualization'
      ],
      specs: {
        'Architecture': 'Model-View-Controller (MVC)',
        'UI Framework': 'JavaFX with custom styling',
        'Database': 'MySQL with custom ORM layer',
        'Authentication': 'Role-based access control',
        'Performance': 'Optimized for low memory footprint'
      },
      demoLink: '#',
      codeLink: '#'
    },
    'cybersecurity': {
      title: 'EncryptPro Application',
      description: `
        <p>EncryptPro is a comprehensive encryption toolkit built with Python and PyQt5, offering an educational and practical interface for exploring various encryption algorithms.</p>
        <p>The application implements multiple classical ciphers (Caesar, ROT13, Playfair, Rail Fence, Row Transposition, Hill, Substitution, Vigenere) and modern cryptography (AES) with a user-friendly GUI. It features light/dark themes, detailed history tracking, and file encryption capabilities.</p>
        <p>Educational components include algorithm explanations, key strength indicators, and visualizations of the encryption process. The tool also includes advanced features like custom ciphers, automated key generation, and comprehensive file operations.</p>
      `,
      gallery: [
        'https://via.placeholder.com/600x400?text=Encryption+Interface',
        'https://via.placeholder.com/600x400?text=Algorithm+Selection',
        'https://via.placeholder.com/600x400?text=File+Encryption'
      ],
      specs: {
        'Frontend': 'PyQt5 with custom styling and themes',
        'Encryption': 'Classical and modern algorithms',
        'Key Management': 'Secure key generation and validation',
        'File Handling': 'Encrypt/decrypt files of any type',
        'History': 'Comprehensive operation tracking and export'
      },
      demoLink: '#',
      codeLink: '#'
    },
    'database': {
      title: 'Stadium Management System',
      description: `
        <p>This Stadium/Sports Club Management System provides a comprehensive solution for managing sports facilities, members, events, and bookings through an intuitive JavaFX interface.</p>
        <p>The system features user authentication with role-based access control, member management with detailed profiles, facility booking and scheduling, event management, and financial reporting capabilities.</p>
        <p>Built with JavaFX for the user interface and MySQL for data storage, the application implements the MVC architecture pattern for maintainable and organized code. It includes features for data validation, search/filter functionality, and detailed reporting with export options.</p>
      `,
      gallery: [
        'https://via.placeholder.com/600x400?text=Club+Dashboard',
        'https://via.placeholder.com/600x400?text=Member+Management',
        'https://via.placeholder.com/600x400?text=Facility+Booking'
      ],
      specs: {
        'UI Framework': 'JavaFX with custom styling',
        'Database': 'MySQL with JDBC connectivity',
        'Architecture': 'Model-View-Controller (MVC)',
        'Features': 'Member management, facility booking, event scheduling, reporting',
        'Security': 'Role-based access control with secure authentication'
      },
      demoLink: '#',
      codeLink: '#'
    }
  };

  // Open modal and populate content
  function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;
    
          // Build modal content
    let modalContent = `
      <div class="modal-gallery">
        ${project.gallery.map((img, index) => `
          <div class="gallery-item">
            <img src="${img}" alt="${project.title} - Screenshot ${index + 1}" loading="lazy">
          </div>
        `).join('')}
      </div>
      <div class="modal-details">
        <div class="project-description">
          <h3>${project.title}</h3>
          ${project.description}
          <div class="project-actions">
            <a href="${project.demoLink}" class="project-btn primary" target="_blank">
              <i class="fas fa-external-link-alt"></i> View Demo
            </a>
            <a href="${project.codeLink}" class="project-btn secondary" target="_blank">
              <i class="fab fa-github"></i> View Code
            </a>
          </div>
        </div>
        <div class="project-specs">
          <h3>Technical Specifications</h3>
          ${Object.entries(project.specs).map(([key, value]) => `
            <div class="spec-item">
              <h4>${key}</h4>
              <p>${value}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Insert content and show modal
    modalBody.innerHTML = modalContent;
    projectModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  // Close modal
  function closeProjectModal() {
    projectModal.classList.remove('show');
    setTimeout(() => {
      modalBody.innerHTML = '';
    }, 300);
    document.body.style.overflow = '';
  }

  // Event listeners
  viewDetailsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = button.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  // Close when clicking outside the modal content
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('show')) {
      closeProjectModal();
    }
  });
  

  
  // Single Upwork Testimonial - No carousel needed
});

// Initialize typing animation when page loads
window.addEventListener('load', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Enhanced project cards hover effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Add pulse animation to profile image
  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    profileImg.classList.add('pulse');
  }
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

revealSections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(50px)';
  section.style.transition = 'all 0.8s ease';
  revealObserver.observe(section);
});

// Add floating particles effect (optional)
function createParticle() {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    width: 4px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.6;
    z-index: -1;
  `;
  
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.top = window.innerHeight + 'px';
  
  document.body.appendChild(particle);
  
  const animation = particle.animate([
    { transform: 'translateY(0px)', opacity: 0.6 },
    { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 }
  ], {
    duration: Math.random() * 3000 + 2000,
    easing: 'linear'
  });
  
  animation.onfinish = () => {
    particle.remove();
  };
}

// Create particles periodically
setInterval(createParticle, 300);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const style = document.createElement('style');
style.textContent = `
  .keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(style);
