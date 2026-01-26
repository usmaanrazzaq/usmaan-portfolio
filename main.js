// Page loader - fade in effect
window.addEventListener('load', function() {
  // Add loaded class to body to trigger fade-in
  document.body.classList.add('loaded');

  // Remove loader if it exists
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 100);
  }
});

// Navigation toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all the elements
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

// Work Directory - Slide and Fade Transitions
document.addEventListener('DOMContentLoaded', function() {
  const workDirectory = document.querySelector('.work-directory');
  const directoryToggle = document.querySelector('.directory-toggle');
  const workTitles = document.querySelectorAll('.work-title');
  const workDisplays = document.querySelectorAll('.work-display');
  
  if (workTitles.length === 0 || workDisplays.length === 0) return;
  
  let isAnimating = false;
  
  // Mobile Directory Toggle - Expand/Collapse
  if (directoryToggle && workDirectory) {
    directoryToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      workDirectory.classList.toggle('expanded');
      const isExpanded = workDirectory.classList.contains('expanded');
      this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
    
    // Close directory when clicking outside (tablet/mobile only)
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 960) {
        if (!workDirectory.contains(e.target)) {
          workDirectory.classList.remove('expanded');
          directoryToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
  
  workTitles.forEach(title => {
    title.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Prevent multiple clicks during animation
      if (isAnimating) return;
      
      const targetWork = this.getAttribute('data-work');
      const currentActive = document.querySelector('.work-title.active');
      const currentDisplay = document.querySelector('.work-display.active');
      const targetDisplay = document.querySelector(`.work-display[data-work="${targetWork}"]`);
      
      // Don't do anything if clicking the already active item
      if (currentActive === this) return;
      
      isAnimating = true;
      
      // Update active state on titles
      workTitles.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // On tablet/mobile, collapse the directory after selection
      if (window.innerWidth <= 960 && workDirectory) {
        setTimeout(() => {
          workDirectory.classList.remove('expanded');
          if (directoryToggle) {
            directoryToggle.setAttribute('aria-expanded', 'false');
          }
        }, 150);
      }
      
      // Animate out the current display (slide up and fade)
      if (currentDisplay) {
        currentDisplay.classList.remove('active');
        currentDisplay.classList.add('exiting');
        
        // After exit animation, show the new display
        setTimeout(() => {
          currentDisplay.classList.remove('exiting');
          currentDisplay.style.display = 'none';
          
          // Prepare and animate in the new display (slide up from below and fade in)
          if (targetDisplay) {
            targetDisplay.style.display = 'flex';
            targetDisplay.classList.add('entering');
            
            // Force reflow
            targetDisplay.offsetHeight;
            
            // Remove entering class and add active to trigger animation
            setTimeout(() => {
              targetDisplay.classList.remove('entering');
              targetDisplay.classList.add('active');
              isAnimating = false;
            }, 50);
          } else {
            isAnimating = false;
          }
        }, 400); // Match CSS transition duration
      } else {
        // If no current display, just show the target
        if (targetDisplay) {
          targetDisplay.style.display = 'flex';
          targetDisplay.classList.add('active');
        }
        isAnimating = false;
      }
    });
  });
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