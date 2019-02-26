const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl
});

const command = process.argv[2];

client.connect(err => {
  if (err) {
    return console.error("Connection Error", err);
  }
  // listPeople(client);
  searchPeople(client, command);
});

function listPeople(db) {
  db.query("SELECT * from famous_people", (err, res) => {
    db.end();
  });
}

function searchPeople(db, searchTerm) {
  const query = `SELECT * FROM famous_people WHERE first_name LIKE ($1::text);`;
  db.query(query, [searchTerm], (err, res) => {
    if (err) throw err;
    console.log("Searching...");
    formatRes(db, searchTerm, res.rows);
  });
}

function formatRes(db, searchTerm, results) {
  console.log(`Found ${results.length} person(s) by the name ${searchTerm}`);
  for (let result in results) {
    let count = Number(result) + 1;
    let birthdate = results[result].birthdate;
    console.log(`- ${count}: ${results[result].first_name} ${results[result].last_name}, born ${birthdate.toString().slice(0, 15)}`);
  }
  db.end();
}
