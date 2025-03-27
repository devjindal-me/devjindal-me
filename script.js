/**
 * Professional Frontend Developer Portfolio JavaScript
 * This file handles all the interactive functionality of the portfolio website:
 * - Navigation and mobile menu handling
 * - Dark/light theme toggle with local storage persistence
 * - Scroll animations and effects
 * - Project filtering system
 * - Skill bar animations
 * - Testimonial slider functionality
 * - Form validation and submission simulation
 */

// ============================
// ELEMENT SELECTORS
// ============================
// Selecting all the DOM elements we'll need to manipulate
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillBars = document.querySelectorAll('.skill-progress');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

// ============================
// INITIALIZATION
// ============================
// Run these functions when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize skill bars with width of 0 to prepare for animation
  initSkillBars();
  
  // Start animations for elements in viewport
  animateElements();
  
  // Check if page is already scrolled to add header styling
  checkHeaderScroll();
  
  // Set the active navigation item based on current scroll position
  updateActiveNavOnScroll();
});

// ============================
// MOBILE MENU FUNCTIONALITY
// ============================
// Toggle mobile menu when hamburger is clicked
if (hamburger) {
  hamburger.addEventListener('click', () => {
    // Toggle active class on hamburger to animate it
    hamburger.classList.toggle('active');
    // Toggle active class on nav links to show/hide the menu
    navLinks.classList.toggle('active');
  });
}

// Close mobile menu when a navigation link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    // Remove active classes to hide the menu
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// ============================
// DARK MODE TOGGLE
// ============================
// Handle dark mode toggle functionality with localStorage persistence
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // Toggle dark mode class on the body
    document.body.classList.toggle('dark-mode');
    
    // Update the icon based on the current theme
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
      // Change to sun icon for dark mode
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      // Save theme preference to localStorage
      localStorage.setItem('theme', 'dark');
    } else {
      // Change to moon icon for light mode
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      // Save theme preference to localStorage
      localStorage.setItem('theme', 'light');
    }
  });
}

// Check if user has a saved theme preference and apply it
if (localStorage.getItem('theme') === 'dark') {
  // Apply dark mode if it was previously selected
  document.body.classList.add('dark-mode');
  const icon = themeToggle.querySelector('i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}

// ============================
// SCROLL EFFECTS
// ============================
// Listen for scroll events to trigger various effects
window.addEventListener('scroll', () => {
  // Check if header should be styled differently based on scroll position
  checkHeaderScroll();
  
  // Update the active navigation link based on current scroll position
  updateActiveNavOnScroll();
  
  // Animate elements that come into viewport while scrolling
  animateElements();
});

// Add/remove the 'scrolled' class to header based on scroll position
function checkHeaderScroll() {
  // If user has scrolled down at least 50px
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// ============================
// PROJECT FILTERING
// ============================
// Handle filtering of project cards when filter buttons are clicked
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to the clicked button
    button.classList.add('active');
    
    // Get the filter value (web, mobile, ui, or all)
    const filter = button.getAttribute('data-filter');
    
    // Filter the project cards based on their category
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        // Show cards that match the filter
        card.style.display = 'block';
        // Animate them back in with a small delay
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Hide cards that don't match the filter with animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        // After animation completes, set display to none
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ============================
// SKILL BAR ANIMATIONS
// ============================
// Initialize skill bars with 0 width for later animation
function initSkillBars() {
  skillBars.forEach(bar => {
    // Get the target percentage from data attribute but start at 0
    const percent = bar.parentElement.getAttribute('data-percent') + '%';
    bar.style.width = '0';
  });
}

// Animate skill bars to their specified percentage width
function animateSkillBars() {
  skillBars.forEach(bar => {
    // Get the percentage from data attribute
    const percent = bar.parentElement.getAttribute('data-percent') + '%';
    // Animate to that width (CSS transition handles the animation)
    bar.style.width = percent;
  });
}

// ============================
// TESTIMONIAL SLIDER
// ============================
// Track the current active slide
let currentSlide = 0;

// Function to show a specific slide and update navigation dots
function showSlide(n) {
  // Hide all testimonial slides
  testimonialSlides.forEach(slide => {
    slide.style.display = 'none';
  });
  
  // Remove active class from all navigation dots
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Calculate the correct slide index (handles wrapping around)
  // This ensures we loop back to the beginning after reaching the end
  // or loop to the end when going back from the first slide
  currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
  
  // Show the current slide and activate its navigation dot
  testimonialSlides[currentSlide].style.display = 'block';
  dots[currentSlide].classList.add('active');
}

// Add click event listeners to previous button
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });
}

// Add click event listeners to next button
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });
}

// Add click event listeners to navigation dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
  });
});

// Auto-advance the slider every 5 seconds
setInterval(() => {
  showSlide(currentSlide + 1);
}, 5000);

// Initialize the slider with the first slide
showSlide(0);

// ============================
// CONTACT FORM VALIDATION
// ============================
// Handle form submission and validation
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    // Prevent the default form submission
    e.preventDefault();
    
    // Initialize validation flag
    let valid = true;
    
    // Get all form field elements
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Name validation - check if empty
    if (name.value.trim() === '') {
      valid = false;
      showError(name, 'Name is required');
    } else {
      removeError(name);
    }
    
    // Email validation - check if empty or invalid format
    if (email.value.trim() === '') {
      valid = false;
      showError(email, 'Email is required');
    } else if (!isValidEmail(email.value)) {
      valid = false;
      showError(email, 'Please enter a valid email');
    } else {
      removeError(email);
    }
    
    // Subject validation - check if empty
    if (subject.value.trim() === '') {
      valid = false;
      showError(subject, 'Subject is required');
    } else {
      removeError(subject);
    }
    
    // Message validation - check if empty
    if (message.value.trim() === '') {
      valid = false;
      showError(message, 'Message is required');
    } else {
      removeError(message);
    }
    
    // If form is valid, send the message and store it for the CMS
    if (valid) {
      // Get the submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Disable button and change text to show submission is in progress
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Create message object to be stored
      const messageData = {
        id: Date.now(), // Use timestamp as unique ID
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        date: new Date().toISOString(),
        isRead: false
      };
      
      // Store the message in localStorage for the CMS
      // In a real application, this would be sent to a server
      saveMessageToLocalStorage(messageData);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Reset form to clear all fields
        contactForm.reset();
        
        // Create and display success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Message sent successfully!';
        contactForm.appendChild(successMessage);
        
        // Restore button to original state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Remove success message after 3 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      }, 1500); // Simulate 1.5 second API call
    }
  });
}

// Function to save message to localStorage for CMS
function saveMessageToLocalStorage(messageData) {
  // Get existing messages or initialize empty array
  let messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
  
  // Add new message to the beginning of the array
  messages.unshift(messageData);
  
  // Save updated messages back to localStorage
  localStorage.setItem('portfolio_messages', JSON.stringify(messages));
}

// Display error message for a form field
function showError(input, message) {
  // Get the parent form group element
  const formGroup = input.parentElement;
  
  // Get existing error message element or create a new one
  const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
  
  // Set error message properties
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  // Add error message to form group if it doesn't already exist
  if (!formGroup.querySelector('.error-message')) {
    formGroup.appendChild(errorElement);
  }
  
  // Add error class to input for styling
  input.className = 'error';
}

// Remove error message from a form field
function removeError(input) {
  // Get the parent form group element
  const formGroup = input.parentElement;
  
  // Find any existing error message
  const errorElement = formGroup.querySelector('.error-message');
  
  // Remove error message if it exists
  if (errorElement) {
    formGroup.removeChild(errorElement);
  }
  
  // Remove error class from input
  input.className = '';
}

// Validate email format using regex
function isValidEmail(email) {
  // Regular expression for email validation
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

// ============================
// SCROLL ANIMATIONS
// ============================
// Animate elements as they enter the viewport
function animateElements() {
  // Define the trigger point (80% of the viewport height)
  const triggerBottom = window.innerHeight * 0.8;
  
  // Check each section to see if it's in the viewport
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    
    // If section is in the viewport
    if (sectionTop < triggerBottom) {
      // Add fade-in animation to the section
      section.classList.add('fadeInUp');
      
      // If this is the skills section, animate the skill bars
      if (section.classList.contains('skills')) {
        animateSkillBars();
      }
      
      // Animate child elements with staggered delay for a wave effect
      const animElements = section.querySelectorAll('.anim-element');
      animElements.forEach((element, index) => {
        // Add staggered delay based on element index
        setTimeout(() => {
          element.classList.add('slideIn');
        }, 150 * index);
      });
    }
  });
}

// ============================
// ACTIVE NAVIGATION HIGHLIGHT
// ============================
// Update the active navigation link based on scroll position
function updateActiveNavOnScroll() {
  // Get current scroll position with a small offset
  const scrollPosition = window.scrollY + 100;
  
  // Check each section to see if the user has scrolled to it
  sections.forEach(section => {
    // Get section position data
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    // If this section is currently in view and has an ID
    if (sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Update the active navigation link
      navItems.forEach(navItem => {
        // Remove active class from all navigation items
        navItem.classList.remove('active');
        
        // Add active class to the matching navigation item
        if (navItem.getAttribute('href') === `#${sectionId}`) {
          navItem.classList.add('active');
        }
      });
    }
  });
}

// ============================
// SETUP ANIMATIONS
// ============================
// Add animation classes to elements that need them
document.querySelectorAll('.skill-item, .project-card, .contact-card').forEach(item => {
  item.classList.add('anim-element');
});

// ============================
// SMOOTH SCROLL
// ============================
// Add smooth scroll behavior to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get the target element ID
    const targetId = this.getAttribute('href');
    
    // Skip for empty hash links
    if (targetId === '#') return;
    
    // Find the target element
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    // Calculate position with offset for fixed header
    const yOffset = -70; // Header height offset
    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    // Scroll smoothly to target
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  });
}); 