'use strict';



/**
 * element toggle function
 */

const toggleElem = function (elem) { elem.classList.toggle("active"); }



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < navTogglers.length; i++) {
  navTogglers[i].addEventListener("click", function () {
    toggleElem(navbar);
    toggleElem(overlay);
  });
}



/**
 * header sticky & back to top button
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    header.classList.add("header-anim");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
    header.classList.remove("header-anim");
  }
});



/**
 * search box toggle
 */

const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const searchBox = document.querySelector("[data-search-box]");

for (let i = 0; i < searchTogglers.length; i++) {
  searchTogglers[i].addEventListener("click", function () {
    toggleElem(searchBox);
  });
}



/**
 * whishlist button toggle
 */

const whishlistBtns = document.querySelectorAll("[data-whish-btn]");

for (let i = 0; i < whishlistBtns.length; i++) {
  whishlistBtns[i].addEventListener("click", function () {
    toggleElem(this);
  });
}



$(document).on('click', '#signIn', function (event) {
  event.preventDefault();
  $('#modal').css('display', 'block');
  $('.modal-bg-signup').hide();
  $('.modal-bg-signin').fadeIn(800);
});


$(document).on('click', '#signUp', function (event) {
  event.preventDefault();
  $('#modal').css('display', 'block');
  $('.modal-bg-signin').hide();
  $('.modal-bg-signup').fadeIn(800);
});

$(document).on('click', '.popup-overlay, .modal-bg', function (e) {
  if (e.target.className == 'popup-overlay') {
      $(".popup-overlay").hide();
  }
  if (e.target.className.includes('modal-bg')) {
      $(".modal-bg").hide();
  }
})

$(document).on('click', '.numberVButton', function (e) {
  $(".popup-overlay").css("display", "flex");
});

$(document).ready(function () {
  $('#date').val(new Date().toISOString().slice(0, 10));
  $('.otpNumber').keyup(function () {
      if (this.value.length === this.maxLength) {
          $(this).next('.otpNumber').focus();
      }
  });
});


// Event listener for counseling form submission
document.getElementById('counsellingForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event?.target);
  try {
      const response = await fetch('http://localhost:5000/api/counsellingform', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
      });
      if (!response.ok) throw new Error('Failed to submit form');
      alert('Form submitted successfully');
  } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
  }
});

 // Function to handle registration form submission
 const register = async (username, email, password) => {
  try {
      const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
          throw new Error('User already exists. Change email.');
      }

      const message = await response.text();
      alert(message); // Alert the success or error message
  } catch (error) {
      console.error('Registration failed due to username or email already existing:', error.message);
      alert(error.message); // Alert the success or error message
  }
};

// Function to handle login form submission
const login = async (email, password) => {
  try {
      const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          throw new Error('Login failed');
      }

      const data = await response.json();
      alert(`Login successful!`); // Alert the token

      // Show logout button and hide login form
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('signIn').style.display = 'none';
      document.getElementById('logoutButton').style.display = 'block';
  } catch (error) {
      console.error('Login failed:', error.message);
  }
};

// Function to handle logout
const logout = () => {
  // Hide logout button and show login form
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('logoutButton').style.display = 'none';
  document.getElementById('signIn').style.display = 'block';
  alert('Logged out successfully!');
};

// Event listener for registration form submission
document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  register(username, email, password);
});

// Event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  login(email, password);
});

// Event listener for logout button
document.getElementById('logoutButton').addEventListener('click', logout);

//contactform
document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://localhost:5000/api/contactform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to submit form');
    alert('Form submitted successfully');
  } catch (error) {
    console.error('Error:', error);
    alert('Error submitting form');
  }
});
