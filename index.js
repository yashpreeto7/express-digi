import logger from "./logger.js";
import morgan from "morgan";
import dotenv from 'dotenv';
dotenv.config();

import express from "express";

const app = express();

const port = process.env.PORT ||3000;
const hostname = "127.0.0.1";
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


let teaData = [];
let nextId = 1;

app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
 return res.status(201).send(newTea);
});


app.get("/teas", (req, res) => {
  return res.status(200).send(teaData);
});

app.get("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const tea = teaData.find((t) => t.id === teaId);
  if (tea) {
    return res.status(200).send(tea);
  } else {
    return res.status(404).send( "tea not found" );
  }
});
app.put("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const tea = teaData.find((t) => t.id === teaId);
  if (!tea) {
    return res.status(404).send("tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  return res.status(200).send(tea);
});
app.delete("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const index = teaData.findIndex((t) => t.id === teaId);
  if (index === -1) {
    return res.status(404).send("tea not  found");
  }
  teaData.splice(index, 1);
  return res.status(204).send("deleted");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
console.log("PORT from .env:", process.env.PORT);
