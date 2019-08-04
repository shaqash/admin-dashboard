/* eslint-disable no-unused-vars */
const FORM_MESSAGE = document.getElementById('form-message');
const FORM = document.getElementById('login-form');
const USERNAME = document.getElementById('username');
const PASSWORD = document.getElementById('password');

/**
 * Checks the login form.
 * @return {boolean} true if login data is valid, otherwise false.
 */
function checkForm() {
  if (!USERNAME.value || !PASSWORD.value) {
    FORM_MESSAGE.innerText = 'all fileds must be filled';
    FORM_MESSAGE.style.color = 'red';
    setTimeout(() => {
      FORM_MESSAGE.innerText = '';
    }, 3000);
    return false;
  }
  return true;
}
