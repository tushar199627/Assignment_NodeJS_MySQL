const jwt = require("jsonwebtoken");

//--------------------------------- AUThorization MIDDLEWARE ------------------------------------------------------------------------

function verifyToken(req, res, next) {
  if (!req.headers["authorization"]) {
    res.status(403).send({ msg: "Not Authorized" });
  }
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "SECRETKEY");
    req.userData = decoded;
    next();
  } catch (err) {
    throw err;
    res.status(403).send({ msg: "Not Authorized" });
  }
}

module.exports = { verifyToken };
