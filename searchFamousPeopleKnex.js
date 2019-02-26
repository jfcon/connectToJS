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

const command = process.argv[2];
searchPeople(command);

function searchPeople(searchTerm) {
  knex
    .select("*")
    .from("famous_people")
    .where("first_name", "=", searchTerm)
    .asCallback(function(err, rows) {
      if (err) return console.error(err);
      displayResults(rows, searchTerm);
    })
    .finally(function() {
      knex.destroy();
    });
}

function displayResults(results, searchTerm) {
  console.log(`Found ${results.length} person(s) by the name ${searchTerm}`);
  for (let result in results) {
    let count = Number(result) + 1;
    let birthdate = results[result].birthdate;
    console.log(`- ${count}: ${results[result].first_name} ${results[result].last_name}, born ${birthdate.toString().slice(0, 15)}`);
  }
}
