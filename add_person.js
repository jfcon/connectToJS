const settings = require("./settings"); // settings.json

const knex = require("knex")({
  client: "pg",
  connection: {
    host: settings.hostname,
    user: settings.user,
    password: settings.password,
    database: settings.database
  }
});

const firstName = process.argv[2];
const lastName = process.argv[3];
const birthday = process.argv[4];
addPerson(firstName, lastName, birthday);

function addPerson(first, last, birth) {
  knex
    .insert({ first_name: first, last_name: last, birthdate: new Date(birth) })
    .into("famous_people")
    .asCallback(function(err) {
      if (err) return console.error(err);
      console.log("Inserted into table!");
    })
    .finally(function() {
      knex.destroy();
    });
}
