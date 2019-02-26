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
    console.log("Err is: ", err);
    console.log("res is:", res.rows);
    console.log("command is: ", command);
    db.end();
  });
}

function searchPeople(db, searchTerm) {
  const query = `SELECT * FROM famous_people WHERE first_name LIKE ($1::text);`;
  db.query(query, [searchTerm], (err, res) => {
    if (err) throw err;
    console.log("res is: ", res.rows);
    db.end();
  });
}
