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