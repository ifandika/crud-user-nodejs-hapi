// Get user list and form elements
const userList = document.getElementById('user-list');
const addUserForm = document.getElementById('add-user-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

// Fetch and display users
function getUsers() {
  fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => {
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
          <strong>${user.name}</strong> (${user.email})
          <button class="btn btn-danger btn-sm float-end ms-2" onclick="deleteUser('${user.id}')">Delete</button>
          <button class="btn btn-warning btn-sm float-end ms-2" onclick="editUser('${user.id}', '${user.name}', '${user.email}')">Edit</button>
        `;
        userList.appendChild(li);
      });
    });
}

// Add new user
addUserForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const newUser = {
    name: nameInput.value,
    email: emailInput.value
  };

  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    getUsers(); // Refresh the user list
  });

  nameInput.value = '';
  emailInput.value = '';
});

// Edit user
function editUser(id, name, email) {
  const newName = prompt('Edit Name:', name);
  const newEmail = prompt('Edit Email:', email);

  if (newName && newEmail) {
    fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, email: newEmail })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      getUsers(); // Refresh the user list
    });
  }
}

// Delete user
function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      getUsers(); // Refresh the user list
    });
  }
}

// Initial load of users
getUsers();