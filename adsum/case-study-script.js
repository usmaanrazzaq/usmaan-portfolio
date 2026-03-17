// Test if script is loading
console.log('=== SCRIPT LOADED ===');

// Mobile video autoplay fix
function handleVideoAutoplay() {
    const video = document.querySelector('.video-container video');
    
    if (video) {
        console.log('Video element found, attempting autoplay...');
        
        // Try to play the video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video autoplay successful');
            }).catch(error => {
                console.log('Video autoplay failed:', error);
                
                // If autoplay fails, try to play on user interaction
                const playOnInteraction = () => {
                    video.play().then(() => {
                        console.log('Video started on user interaction');
                    }).catch(e => {
                        console.log('Video failed to start:', e);
                    });
                    
                    // Remove listeners after first interaction
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('scroll', playOnInteraction);
                };
                
                // Add listeners for user interaction
                document.addEventListener('touchstart', playOnInteraction);
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('scroll', playOnInteraction);
            });
        }
        
        // Additional fallback - force play on load
        video.addEventListener('loadeddata', () => {
            if (video.paused) {
                video.play().catch(e => {
                    console.log('Video play on load failed:', e);
                });
            }
        });
        
        // Force video to be ready
        video.load();
    }
}

// Call video autoplay handler immediately
handleVideoAutoplay();

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
