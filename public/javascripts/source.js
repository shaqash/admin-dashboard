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
  button.classList.add('btn');
  const iconElement = document.createElement('i');
  iconElement.classList.add('fas', icon, 'icon-user', 'fa-2x');
  button.appendChild(iconElement);
  return button;
}

/**
 * Creates a delete button
 * @param {*} username
 * @return {object} button element
 */
function createDeleteButton(username) {
  const button = createButton('fa-trash');
  button.classList.add('delete-button');
  button.addEventListener('click', () => {
    // TODO complete delete feature
    fetch(`${window.location.origin}/users/${username}`, {method: 'DELETE',
      credentials: 'same-origin'}).then((res) => {
      if (res.status === 200) {
        const table = document.getElementById('users-body');
        const row = document.getElementById(`${username}-row`);
        table.removeChild(row);
      }
    });
  });
  return button;
}

/**
 * Creates a delete button
 * @param {*} sid
 * @param {*} index
 * @return {object} button element
 */
function createDestroyButton(sid, index) {
  const button = createButton('fa-trash');
  button.classList.add('delete-button');
  button.addEventListener('click', () => {
    fetch(`${window.location.origin}/sessions/${sid}`, {method: 'DELETE',
      credentials: 'same-origin'}).then((res) => {
      if (res.status === 200) {
        const table = document.getElementById('sessions-body');
        const row = document.getElementById(`${index}-row`);
        table.removeChild(row);
      }
    });
  });
  return button;
}

/**
 * Creates an update button
 * @param {*} username
 * @return {object} button element
 */
function createUpdateButton(username) {
  const button = createButton('fa-edit');
  button.addEventListener('click', () => {
    // TODO complete update feature
  });
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
function createRowUsers(index, username, password, name) {
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
  editButton.appendChild(createUpdateButton(username));
  row.appendChild(editButton);
  const trashButton = document.createElement('td');
  trashButton.appendChild(createDeleteButton(username));
  row.appendChild(trashButton);
  row.id = `${username}-row`;
  return row;
}

/**
 * Creates a row element.
 *
 * @param {string} index
 * @param {string} expires
 * @param {string} uname
 * @param {string} sid
 * @return {object} row element
 */
function createRowSessions(index, expires, uname, sid) {
  const row = document.createElement('tr');
  const indexElement = makeElement('td', index);
  row.appendChild(indexElement);
  const expiresElement = makeElement('td', expires);
  row.appendChild(expiresElement);
  const usernameElement = makeElement('td', uname);
  row.appendChild(usernameElement);
  const destroyButton = document.createElement('td');
  destroyButton.appendChild(createDestroyButton(sid, index));
  row.appendChild(destroyButton);
  row.id = `${index}-row`;
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
const usersBody = document.getElementById('users-body');
document.addEventListener('DOMContentLoaded', (event) => {
  fetch(window.location.origin + '/users.json', {credentials: 'same-origin'})
      .then((res) => {
        return res.json();
      }).then((json) => {
        json.forEach((value, key) => {
          const row = createRowUsers(key+1, value.username, value.password,
              value.name);
          usersBody.appendChild(row);
        });
        usersTable.style.display='table';
      });
});

const sessionTable = document.getElementById('sessions-table');
const sessionBody = document.getElementById('sessions-body');
document.addEventListener('DOMContentLoaded', (event) => {
  fetch(window.location.origin + '/sessions/json', {credentials: 'same-origin'})
      .then((res) => {
        return res.json();
      }).then((json) => {
        json.forEach((value, key) => {
          const uname = JSON.parse(value.session)['username'];
          const row = createRowSessions(key+1, value.expires, uname, value._id);
          sessionBody.appendChild(row);
        });
        sessionTable.style.display='table';
      });
});
