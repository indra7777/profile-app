// knexfile.js
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "developer", // replace with your MySQL username
      password: "indra@123", // replace with your MySQL password
      database: "profile", // replace with your database name
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
  // other environments like production can be added here
};
