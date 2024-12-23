const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");

dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers["authorization"];
    const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

    return decodedJwt;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요" });
  }
};

module.exports = ensureAuthorization;
