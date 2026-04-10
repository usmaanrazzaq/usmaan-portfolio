// Test if script is loading
console.log('=== SCRIPT LOADED ===');

// Wait for page to load completely
window.addEventListener('load', function() {
    console.log('=== PAGE LOADED ===');

    // Find elements
    const toggle = document.querySelector('.nav-toggle');
    const navBar = document.querySelector('.nav-bar');
    const navList = document.querySelector('.nav-bar ul');

    console.log('Toggle button:', toggle);
    console.log('Nav bar:', navBar);
    console.log('Nav list:', navList);

    if (toggle) {
        console.log('Adding click listener to toggle button');

        toggle.addEventListener('click', function(e) {
            console.log('=== BUTTON CLICKED ===');

            if (navBar) {
                navBar.classList.toggle('expanded');
                console.log('Toggled expanded class - current classes:', navBar.className);
            }
        });
    } else {
        console.log('❌ Toggle button not found!');
    }
});

// Initialize scroll animations and interactive components
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    if (typeof initImageCompare === 'function') initImageCompare();
    if (typeof initStatCounters === 'function') initStatCounters();
    if (typeof initAnnotatedImages === 'function') initAnnotatedImages();
});

// Directory scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED ===');

    const directoryLinks = document.querySelectorAll('.directory-list a');
    const sections = document.querySelectorAll('.content-block');

    console.log('Found directory links:', directoryLinks.length);
    console.log('Found sections:', sections.length);

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
});

// Lightbox
function openLightbox(container) {
    const img = container.querySelector('img');
    const overlay = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    if (e.target.classList.contains('lightbox-img')) return;
    const overlay = document.getElementById('lightbox');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('lightbox');
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
