// Navigation toggle functionality
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-bar');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('expanded');
  });
}

// Directory scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
  const directoryLinks = document.querySelectorAll('.directory-list a');
  const sections = document.querySelectorAll('.content-block');
  
  // Smooth scroll to section when directory link is clicked
  directoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      directoryLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Get target section
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Calculate offset for sticky navigation
        const offset = 100;
        const targetPosition = targetSection.offsetTop - offset;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active link based on scroll position
  function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    // Update active states
    directoryLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', updateActiveLink);
  
  // Set initial active state
  updateActiveLink();
  
  // Intersection Observer for better performance (alternative to scroll listener)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update active link
        directoryLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
});

// Add scroll progress indicator (optional enhancement)
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background-color: #2b2b2b;
    z-index: 1000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Initialize scroll progress (uncomment if desired)
// createScrollProgress();
