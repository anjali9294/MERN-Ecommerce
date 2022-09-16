const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//uncaugthException
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shutting down the server due touncaugthException`);

  process.exit(1);
});

// config
dotenv.config({ path: "backend/config/config.env" });

// connecting to databese
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log("server is working on http://localhost:" + process.env.PORT);
});

// unhandaled Promise  rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shutting down the server due to unhandaled Promise  rejection`);
  server.close();
  process.exit(1);
});
