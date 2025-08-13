// Get all the elements
const header = document.querySelector('header');
const logo = document.querySelector('.logo');
const nav = document.querySelector('nav');
const ul = document.querySelector('ul');
const li = document.querySelectorAll('li');

// Add event listener to the logo
logo.addEventListener('click', () => {
    window.location.href = '#home';
});

const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('expanded');
  });
}

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