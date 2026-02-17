function onDomReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
    return;
  }
  fn();
}

function loadNav() {
  const navContainer = document.getElementById('nav-container');
  if (!navContainer) return;

  const path = navContainer.getAttribute('data-path') || '/nav.html';

  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Nav request failed: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      navContainer.innerHTML = html;
      // Initialize nav toggle after loading
      initNavToggle();
    })
    .catch(err => {
      console.error('Error loading nav:', err);
      // Fallback: inject nav directly if fetch fails
      navContainer.innerHTML = `
        <nav class="nav-bar">
          <a href="/" class="logo">Usmaan Razzaq</a>
          <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-menu" aria-haspopup="true">
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
          </button>
          <ul id="nav-menu" class="nav-menu" data-state="closed">
            <li><a href="/Projects/projects/index.html">Projects</a></li>
            <li><a href="/Sandbox/index.html">Sandbox</a></li>
            <li><a href="/About/about/index.html">About</a></li>
            <li><a href="mailto:usmaanrazzaq.designs@gmail.com" title="Contact" target="_blank">Contact</a></li>
          </ul>
        </nav>
      `;
      initNavToggle();
    });
}

// Load nav dynamically
onDomReady(loadNav);

// Load footer dynamically
onDomReady(function () {
  const footerContainer = document.getElementById('footer-container');
  if (!footerContainer) return;

  // Determine the correct path to footer.html based on current page depth
  const path = footerContainer.getAttribute('data-path') || '/footer.html';

  fetch(path)
    .then(response => response.text())
    .then(html => {
      footerContainer.innerHTML = html;
    })
    .catch(err => {
      console.error('Error loading footer:', err);
    });
});

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

// Navigation toggle functionality - reusable function
function initNavToggle() {
  const logo = document.querySelector('.logo');
  const nav = document.querySelector('.nav-bar');
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = nav ? nav.querySelector('ul') : null;

  // Add event listener to the logo
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  // Mobile nav toggle
  if (toggle && nav && navMenu) {
    function setNavOpenState(isOpen) {
      nav.classList.toggle('expanded', isOpen);
      nav.setAttribute('data-state', isOpen ? 'open' : 'closed');
      navMenu.setAttribute('data-state', isOpen ? 'open' : 'closed');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    setNavOpenState(false);

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = nav.classList.contains('expanded');
      setNavOpenState(!isExpanded);
    });

    // Close menu when clicking on nav links
    const navLinks = nav.querySelectorAll('ul li a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setNavOpenState(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        setNavOpenState(false);
      }
    });

    // Escape closes menu for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setNavOpenState(false);
      }
    });

    // Reset mobile nav state on desktop/tablet resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setNavOpenState(false);
      }
    });
  }
}

// Initialize nav toggle for pages with static nav (fallback)
document.addEventListener('DOMContentLoaded', function() {
  // Only init if nav-container doesn't exist (static nav)
  if (!document.getElementById('nav-container')) {
    initNavToggle();
  }
});

// Work Directory - Slide and Fade Transitions
document.addEventListener('DOMContentLoaded', function() {
  const workDirectory = document.querySelector('.work-directory');
  const directoryHeader = document.querySelector('.directory-header');
  const workTitles = document.querySelectorAll('.work-title');
  const workDisplays = document.querySelectorAll('.work-display');
  
  if (workTitles.length === 0 || workDisplays.length === 0) return;
  
  let isAnimating = false;
  
  // Mobile Directory Toggle - Expand/Collapse (click on header)
  if (directoryHeader && workDirectory) {
    function toggleDirectory(e) {
      // Only toggle on tablet/mobile
      if (window.innerWidth <= 960) {
        e.preventDefault();
        e.stopPropagation();
        
        workDirectory.classList.toggle('expanded');
        const isExpanded = workDirectory.classList.contains('expanded');
        directoryHeader.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }
    }
    
    directoryHeader.addEventListener('click', toggleDirectory);
    
    // Keyboard support for accessibility
    directoryHeader.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleDirectory(e);
      }
    });
    
    // Close directory when clicking outside (tablet/mobile only)
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 960) {
        if (!workDirectory.contains(e.target)) {
          workDirectory.classList.remove('expanded');
          directoryHeader.setAttribute('aria-expanded', 'false');
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
          if (directoryHeader) {
            directoryHeader.setAttribute('aria-expanded', 'false');
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

// EST Timestamp and Availability Indicator
document.addEventListener('DOMContentLoaded', function() {
  const timeElement = document.getElementById('est-time');
  const availabilityIndicator = document.querySelector('.availability-indicator');
  const availabilityText = document.getElementById('availability-text');
  
  // Availability configuration - set to true for available, false for not available
  const isAvailable = true;
  
  // Update availability state
  if (availabilityIndicator && availabilityText) {
    if (isAvailable) {
      availabilityIndicator.classList.remove('not-available');
      availabilityText.textContent = 'Available for freelance work';
    } else {
      availabilityIndicator.classList.add('not-available');
      availabilityText.textContent = 'Not available for work';
    }
  }
  
  // Update EST time
  function updateESTTime() {
    if (!timeElement) return;
    
    const now = new Date();
    
    // Format time in EST (America/New_York handles EST/EDT automatically)
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const timeString = formatter.format(now).toLowerCase();
    
    timeElement.textContent = timeString;
  }
  
  // Initial update
  updateESTTime();
  
  // Update every minute
  setInterval(updateESTTime, 60000);
});