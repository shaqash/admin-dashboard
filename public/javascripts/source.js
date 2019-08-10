/**
 * Creates a html elemtent.
 *
 * @param {string} tag the element tag
 * @param {string} text the inner text
 * @return {object} html element
 */
function makeElement(tag, text) {
  const element = document.createElement(tag);
  element.innerText = text;
  return element;
}
/**
 * Creates button with icon.
 * @param {string} icon font awesome icon text
 * @return {object} button element
 */
function createButton(icon) {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-default');
  const iconElement = document.createElement('i');
  iconElement.classList.add('fas', icon, 'icon-user');
  button.appendChild(iconElement);
  return button;
}

/**
 * Creates a row element.
 *
 * @param {string} index
 * @param {string} username
 * @param {string} password
 * @param {string} name
 * @return {object} row element
 */
function createRow(index, username, password, name) {
  const row = document.createElement('tr');
  const indexElement = makeElement('td', index);
  row.appendChild(indexElement);
  const usernameElement = makeElement('td', username);
  row.appendChild(usernameElement);
  const passwordElement = makeElement('td', password);
  row.appendChild(passwordElement);
  const nameElement = makeElement('td', name);
  row.appendChild(nameElement);
  const editButton = document.createElement('td');
  editButton.appendChild(createButton('fa-edit'));
  row.appendChild(editButton);
  const trashButton = document.createElement('td');
  trashButton.appendChild(createButton('fa-trash'));
  row.appendChild(trashButton);
  return row;
}

// Toggle side bar
const toggleButton = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
toggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  wrapper.classList.toggle('toggled');
});

const usersTable = document.getElementById('users-table');
const tableBody = document.getElementById('table-body');
document.addEventListener('DOMContentLoaded', (event) => {
  fetch(window.location.origin + '/users.json', {credentials: 'same-origin'})
      .then((res) => {
        return res.json();
      }).then((json) => {
        json.forEach((value, key) => {
          const row = createRow(key+1, value.username, value.password,
              value.name);
          tableBody.appendChild(row);
        });
        usersTable.style.display='table';
      });
});
