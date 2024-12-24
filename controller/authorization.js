const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");

dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers["authorization"];

    if (receivedJwt) {
      const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
      return decodedJwt;
    }

    throw new ReferenceError("jwt is not defined");
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    return err;
  }
};

module.exports = ensureAuthorization;
