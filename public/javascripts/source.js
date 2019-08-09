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
          const row = document.createElement('tr');
          const index = document.createElement('td');
          index.innerText=key + 1;
          row.appendChild(index);
          const username = document.createElement('td');
          username.innerText = value.username;
          row.appendChild(username);
          const password = document.createElement('td');
          password.innerText = value.password;
          row.appendChild(password);
          const name = document.createElement('td');
          name.innerText = value.name;
          row.appendChild(name);
          tableBody.appendChild(row);
        });
        usersTable.style.display='table';
      });
});
