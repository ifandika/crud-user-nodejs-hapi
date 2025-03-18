// server.js
const Hapi = require('@hapi/hapi');
const users = []; // In-memory "database" for simplicity
const Inert = require('@hapi/inert');
const Path = require('path');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, h) {
      return h.file('public/index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'public'),
        index: false
      }
    }
  });

  // GET all users
  server.route({
    method: 'GET',
    path: '/users',
    handler: (request, h) => {
      return users;
    }
  });

  // POST new user
  server.route({
    method: 'POST',
    path: '/users',
    handler: (request, h) => {
      const newUser = request.payload;
      users.push(newUser);
      console.log(newUser);
      return { message: 'User added successfully', user: newUser };
    }
  });

  // PUT (update) user by ID
  server.route({
    method: 'PUT',
    path: '/users/{id}',
    handler: (request, h) => {
      const userId = request.params.id;
      const updatedUser = request.payload;
      const index = users.findIndex(user => user.id == userId);

      if (index !== -1) {
        users[index] = { id: userId, ...updatedUser };
        return { message: 'User updated successfully', user: users[index] };
      }
      return { message: 'User not found' };
    }
  });

  // DELETE user by ID
  server.route({
    method: 'DELETE',
    path: '/users/{id}',
    handler: (request, h) => {
      const userId = request.params.id;
      const index = users.findIndex(user => user.id == userId);

      if (index !== -1) {
        const removedUser = users.splice(index, 1);
        return { message: 'User deleted successfully', user: removedUser };
      }
      return { message: 'User not found' };
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
