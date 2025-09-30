// Navigation toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all the elements
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo');
  const nav = document.querySelector('.nav-bar');
  const toggle = document.querySelector('.nav-toggle');
  

  // Add event listener to the logo
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nav.classList.toggle('expanded');
      const isExpanded = nav.classList.contains('expanded');
      toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      
      // Force a reflow to ensure the animation triggers
      nav.offsetHeight;
    });

    // Close menu when clicking on nav links
    const navLinks = nav.querySelectorAll('ul li a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Dropdown functionality for skills and tools containers
document.addEventListener('DOMContentLoaded', function() {
  const dropdownHeaders = document.querySelectorAll('.dropdown-header');
  
  dropdownHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      const isActive = this.classList.contains('active');
      
      // Close all other dropdowns first
      dropdownHeaders.forEach(otherHeader => {
        if (otherHeader !== this) {
          const otherTargetId = otherHeader.getAttribute('data-target');
          const otherTargetContent = document.getElementById(otherTargetId);
          otherHeader.classList.remove('active');
          if (otherTargetContent) {
            otherTargetContent.classList.remove('active');
          }
        }
      });
      
      // Toggle current dropdown
      if (isActive) {
        this.classList.remove('active');
        if (targetContent) {
          targetContent.classList.remove('active');
        }
      } else {
        this.classList.add('active');
        if (targetContent) {
          targetContent.classList.add('active');
        }
      }
    });
  });
});