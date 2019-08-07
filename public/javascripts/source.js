// Toggle side bar
const toggleButton = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
toggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  wrapper.classList.toggle('toggled');
});
