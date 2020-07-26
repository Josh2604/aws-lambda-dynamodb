const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

const { TEST_TABLE, IS_OFFLINE } = process.env;

const dynamoDb =
  IS_OFFLINE === "true"
    ? new AWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000"
      })
    : new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get("/test", (req, res) => {
  dynamoDb.scan({TableName: TEST_TABLE}, (error, result) => {
    if (error) {
      res.status(400).json({ error: "Error al intentar leer tabla test" });
    }
    res.json({ Items: result.testTable });
  });
});

module.exports.handler = serverless(app);