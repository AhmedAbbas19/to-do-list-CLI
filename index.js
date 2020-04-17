const chalk = require("chalk");
const fs = require("fs");
const { program } = require("commander");
program.version("0.0.1");

program
  .option("-t, --title <type>", "note title")
  .option("-i, --id <type>", "note id")
  .option("-s, --status <type>", "note status")
  .parse(process.argv);

// console.log(program.opts());

const myStatus = ["to-do", "done", "in progress"];

const readDB = () => {
  let db = fs.readFileSync("db.json", "utf8") || "[]";
  return JSON.parse(db);
};
const writeDB = (db) => {
  fs.writeFileSync("db.json", JSON.stringify(db));
};
const addNote = (title) => {
  if (!title) {
    throw new Error("Title is required for this action");
  }
  const db = readDB();
  const newEntry = {
    id: Date.now(),
    title,
    status: "to-do",
  };
  db.push(newEntry);

  writeDB(db);
  console.log(chalk.green("Note added successfully."));
};
const listNotes = (status) => {
  if (status && !myStatus.includes(status)) {
    throw new Error("Status value must be 'to-do', done' or 'in progress'.");
  }
  const db = readDB();
  for (const note of db) {
    if (note.status === status || status === undefined) {
      console.log(
        chalk.blue("[Title: " + note.title + ", Status: " + note.status + "]")
      );
    }
  }
};
const editNote = (newTitle, newStatus, id) => {
  if (!id) {
    throw new Error("Id is required for this action");
  }
  if (!newTitle && !newStatus) {
    throw new Error("Title or status is required for this action");
  }
  if (newStatus && !myStatus.includes(newStatus)) {
    throw new Error("Status value must be 'to-do', done' or 'in progress'.");
  }
  const db = readDB();

  const noteIdx = db.findIndex((n) => n.id === +id);
  if (noteIdx === -1) {
    console.log(chalk.red("Note id is invalid."));
  } else {
    if (newStatus) {
      db[noteIdx].status = newStatus;
    }
    if (newTitle) {
      db[noteIdx].title = newTitle;
    }
    writeDB(db);
    console.log(chalk.green("Note edited successfully"));
  }
};
const deleteNote = (id) => {
  if (!id) {
    throw new Error("Id is required for this action");
  }
  const db = readDB();

  const noteIdx = db.findIndex((n) => n.id === +id);
  if (noteIdx === -1) {
    console.log(chalk.red("Note id is invalid."));
  } else {
    db.splice(noteIdx, 1);
    writeDB(db);
    console.log(chalk.green("Note deleted successfully"));
  }
};

const [, , action] = process.argv;

switch (action.toLowerCase()) {
  case "add":
    addNote(program.title);
    break;
  case "list":
    listNotes(program.status);
    break;
  case "edit":
    editNote(program.title, program.status, program.id);
    break;
  case "delete":
    deleteNote(program.id);
    break;
  default:
    console.log(
      chalk.red(
        "Invalid action. Try 'node index.js add -t Good' to add new note ;)"
      )
    );
    break;
}
