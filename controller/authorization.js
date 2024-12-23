const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const ensureAuthorization = (req) => {
  const receivedJwt = req.headers["authorization"];
  const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

  return decodedJwt;
};

module.exports = ensureAuthorization;
