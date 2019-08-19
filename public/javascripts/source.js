/**
 * Creates an html elemtent.
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
 *
 * @param {string} username
 * @param {string} index
 * @return {object} button element
 */
function createDeleteButton(username, index) {
  const button = createButton('fa-trash');
  button.classList.add('delete-button');
  button.addEventListener('click', () => {
    fetch(`${window.location.origin}/users/${username}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    }).then((res) => {
      if (res.status === 200) {
        const table = document.getElementById('users-body');
        const row = document.getElementById(`${index}-user-row`);
        table.removeChild(row);

        // update indexes and id
        userRow = document.getElementById(`${index+1}-user-row`);
        while (userRow) {
          userRow.id = `${index}-user-row`;
          userRow.firstChild.innerText = index;
          index++;
          userRow = document.getElementById(`${index+1}-user-row`);
        }
      }
    });
  });
  return button;
}

/**
 * Creates a delete button
 * @param {*} sessionId
 * @param {*} index
 * @return {object} button element
 */
function createDestroyButton(sessionId, index) {
  const button = createButton('fa-trash');
  button.classList.add('delete-button');
  button.addEventListener('click', () => {
    fetch(`${window.location.origin}/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    }).then((res) => {
      if (res.status === 200) {
        const table = document.getElementById('sessions-body');
        const row = document.getElementById(`${index}-session-row`);
        table.removeChild(row);
      }
    });
  });
  return button;
}


/**
 * Creates an update button for user row
 *
 * @param {string} index
 * @return {object} button element
 */
function createUpdateButton(index) {
  const button = createButton('fa-edit');
  button.addEventListener('click', () => {
    const userRow = document.getElementById(`${index}-user-row`);
    const username = userRow.children[1].innerText;
    const name = userRow.children[3].innerText;
    for (let i = 1; i <= 5; i++) {
      userRow.children[i].style.display = 'none';
    }
    const tableData = [];
    // username update field
    const usernameUpdate = document.createElement('td');
    const usernameUpdateInput = document.createElement('input');
    usernameUpdateInput.classList.add('form-control');
    usernameUpdateInput.value = username;
    usernameUpdateInput.type = 'text';
    usernameUpdateInput.placeholder = 'Username';
    usernameUpdate.appendChild(usernameUpdateInput);
    tableData.push(usernameUpdate);
    // password update fields
    const passwordUpdate = document.createElement('td');
    const passwordUpdateInput = document.createElement('input');
    const passwordWrapper = document.createElement('div');
    passwordWrapper.classList.add('password-wrapper');
    passwordUpdateInput.classList.add('form-control');
    passwordUpdateInput.type = 'password';
    passwordUpdateInput.placeholder = 'Password';
    passwordUpdateInput.style.marginRight = '2em';
    const password2UpdateInput = document.createElement('input');
    password2UpdateInput.classList.add('form-control');
    password2UpdateInput.type = 'password';
    password2UpdateInput.placeholder = 'Confirm password';
    passwordWrapper.appendChild(passwordUpdateInput);
    passwordWrapper.appendChild(password2UpdateInput);
    passwordUpdate.appendChild(passwordWrapper);
    tableData.push(passwordUpdate);
    // name update fields
    const nameUpdate = document.createElement('td');
    const nameUpdateInput = document.createElement('input');
    nameUpdateInput.classList.add('form-control');
    nameUpdateInput.value = name;
    nameUpdateInput.type = 'text';
    nameUpdateInput.placeholder = 'Name';
    nameUpdate.appendChild(nameUpdateInput);
    tableData.push(nameUpdate);
    // approve and deny buttons
    const allowButtonTd = document.createElement('td');
    const allowButton = createButton('fa-check');
    allowButton.classList.add('green-hover');
    allowButtonTd.appendChild(allowButton);
    allowButton.addEventListener('click', (event) => {
      fetch(window.location.origin + '/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          update: {
            username: usernameUpdateInput.value,
            password: passwordUpdateInput.value,
            password2: password2UpdateInput.value,
            name: nameUpdateInput.value,
          },
        }),
        credentials: 'same-origin',
      }).then((res) => {
        return res.json();
      }).then((res) => {
        if (!res.errors) {
          tableData.forEach((value, key) => {
            userRow.removeChild(value);
            if (res.username) {
              userRow.children[1].innerText = res.username;
            }
            if (res.password) {
              userRow.children[2].innerText = res.password;
            }
            if (res.name) {
              userRow.children[3].innerText = res.name;
            }
            for (let i = 1; i <= 5; i++) {
              userRow.children[i].style.display = 'table-cell';
            }
          });
        } else {
          res.errors.forEach((value, key) => {
            console.log(value);
          });
        }
      });
    });
    const denyButtonTd = document.createElement('td');
    const denyButton = createButton('fa-times');
    denyButton.classList.add('red-hover');
    denyButtonTd.appendChild(denyButton);
    denyButton.addEventListener('click', (event) => {
      tableData.forEach((value, key) => {
        userRow.removeChild(value);
        for (let i = 1; i <= 5; i++) {
          userRow.children[i].style.display = 'table-cell';
        }
      });
    });
    tableData.push(allowButtonTd);
    tableData.push(denyButtonTd);
    tableData.forEach((value, key) => {
      userRow.appendChild(value);
    });
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
function createUserRow(index, username, password, name) {
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
  editButton.appendChild(createUpdateButton(index));
  row.appendChild(editButton);
  const trashButton = document.createElement('td');
  trashButton.appendChild(createDeleteButton(username, index));
  row.appendChild(trashButton);
  row.id = `${index}-user-row`;
  return row;
}

/**
 * Creates a row element.
 *
 * @param {string} index
 * @param {string} expires
 * @param {string} username
 * @param {string} sessionId
 * @return {object} row element
 */
function createSessionRow(index, expires, username, sessionId) {
  const row = document.createElement('tr');
  const indexElement = makeElement('td', index);
  row.appendChild(indexElement);
  const expiresElement = makeElement('td', expires);
  row.appendChild(expiresElement);
  const usernameElement = makeElement('td', username);
  row.appendChild(usernameElement);
  const destroyButton = document.createElement('td');
  destroyButton.appendChild(createDestroyButton(sessionId, index));
  row.appendChild(destroyButton);
  row.id = `${index}-session-row`;
  return row;
}

/**
 * Creates a new user row
 *
 */
function createNewUserRow() {
  const row = document.getElementById('new-user-template').
      content.cloneNode(true);
  const userTable = document.getElementById('users-table');
  userTable.appendChild(row);
  const approveButton = document.getElementById('approve-new-user');
  approveButton.addEventListener('click', (event) => {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const password2 = document.getElementById('new-password2').value;
    const name = document.getElementById('new-name').value;

    fetch(window.location.origin + '/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        password2: password2,
        name: name,
      }),
      credentials: 'same-origin',
    }).then((res) => {
      return res.json();
    }).then((res) => {
      if (!res.errors) {
        const usersBody = document.getElementById('users-body');
        const index = usersBody.childElementCount + 1;
        const userRow = createUserRow(index, username, res.hash, name);
        usersBody.appendChild(userRow);
        // reset value in new user inputs
        document.querySelectorAll('#new-user-row input').
            forEach((value, key) => {
              value.value = '';
            });
      } else {
        // TODO handle error with bootstrap notifications/alerts
        res.errors.forEach((value, key) => {
          console.log(value);
        });
      }
    });
  });
  const denyButton = document.getElementById('deny-new-user');
  denyButton.addEventListener('click', (event) => {
    const newUserRow = document.getElementById('new-user-row');
    userTable.removeChild(newUserRow);
    const addNewUserRow = document.getElementById('table-footer');
    addNewUserRow.style.display = 'table-footer-group';
  });
}

// Toggle side bar
const toggleButton = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
if (toggleButton) {
  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.toggle('toggled');
  });
}
const usersTable = document.getElementById('users-table');
const usersBody = document.getElementById('users-body');
if (usersTable) {
  document.addEventListener('DOMContentLoaded', (event) => {
    fetch(window.location.origin + '/users/json', {
      credentials: 'same-origin',
    })
        .then((res) => {
          return res.json();
        }).then((json) => {
          json.forEach((value, key) => {
            const row = createUserRow(key + 1, value.username, value.password,
                value.name);
            usersBody.appendChild(row);
          });
          usersTable.style.display = 'table';
        });
  });

  const addNewUserButton = document.getElementById('add-user-btn');
  if (addNewUserButton) {
    addNewUserButton.addEventListener('click', (event) => {
      const addNewUserRow = document.getElementById('table-footer');
      addNewUserRow.style.display = 'none';
      createNewUserRow();
    });
  }
}
const sessionTable = document.getElementById('sessions-table');
const sessionBody = document.getElementById('sessions-body');
if (sessionTable) {
  document.addEventListener('DOMContentLoaded', (event) => {
    fetch(window.location.origin + '/sessions/json', {
      credentials: 'same-origin',
    })
        .then((res) => {
          return res.json();
        }).then((json) => {
          json.forEach((value, key) => {
            const username = JSON.parse(value.session)['username'];
            const row = createSessionRow(key + 1, username, value.expires,
                value._id);
            sessionBody.appendChild(row);
          });
          sessionTable.style.display = 'table';
        });
  });
}
