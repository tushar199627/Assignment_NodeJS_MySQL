const express = require("express");
const router = express.Router();
const mysqlConnection = require("../connection");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");



//#########################################Create Database#######################################################
router.get("/createDb", (req, res) => {
  try {
    let sql = "CREATE DATABASE files";
    mysqlConnection.query(sql, (err, result) => {
      console.log(result);
      return res.status(201).send("Database created");
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});



//####################################################create Table##############################################################
router.get("/createTable", (req, res) => {
  try {
    let sql =
      "CREATE TABLE profiles(id int AUTO_INCREMENT, fullname VARCHAR(255), emailId VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))";
    mysqlConnection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      return res.status(201).send("profile created successfully");
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});



//###################################################create user###################################################################
router.post("/createUser", (req, res) => {
  try {
    // sql query
    let sql = ` INSERT INTO profiles(id,fullname,emailId,password)
                VALUES('${req.body.id}','${req.body.fullname}','${req.body.emailId}','${req.body.password}')
               `;

    mysqlConnection.query(
      `SELECT * FROM profiles WHERE id= ${mysqlConnection.escape(
        //checking if id is already present in the database or what
        req.body.id
      )};`,
      (err, result) => {
        if (err) {
          throw err;
        }

        if (result.length) {
          return res.status(400).send({ msg: "Id already exist" });
        }
      }
    );

    if (!req.body.emailId) {
      //email is a mandatory field
      return res.status(400).send("email is required");
    }

    mysqlConnection.query(
      `SELECT * FROM profiles WHERE emailId= ${mysqlConnection.escape(
        //validating if Emailid already present in the database
        req.body.emailId
      )};`,
      (err, result) => {
        if (err) {
          throw err;
        }

        if (result.length) {
          return res.status(400).send({ msg: "email id already exist" });
        }
      }
    );

    if (!req.body.password) {
      //password is a mandatory field
      return res.status(400).send("password is required");
    }

    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.emailId)
    ) {
      //validating the email
      return res.status(400).send("enter a valid email");
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(req.body.password)) {
      //validating the password
      return res
        .status(400)
        .send(
          "password should contain atleastone number or one alphabet and should be 9 character long"
        );
    }
    // run query
    mysqlConnection.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(201).send({ msg: "data created", data: result });
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


//############################################################login user############################################################
router.post("/login", (req, res) => {
  try {
    mysqlConnection.query(
      `SELECT * FROM profiles WHERE emailId= ${mysqlConnection.escape(
        req.body.emailId
      )};`,
      (err, result) => {
        if (err) {
          throw err;
        }

        if (!result.length) {
          return res.status(400).send({ msg: "email id or password is incorrect" });
        }

        if (req.body.password != result[0].password) {
          return res.status(400).send({ msg: "email id or password is incorrect" });
        } else {
          const token = jwt.sign(
            //jwt token genearation
            {
              emailId: result[0].emailId,
              userId: result[0].id,
            },
            "SECRETKEY",
            { expiresIn: "2d" }
          );
          return res.status(200).send({
            msg: "Logged In",
            token: token,
            user: result[0],
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
});



//############################################################fetch the deatil of user###################################################
router.get("/getUsers", verifyToken, (req, res) => {
  try {
    // sql query

    let sql = `SELECT * FROM profiles`;
    // run query
    mysqlConnection.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});




// ################################################################# update the user#######################################################
router.put("/updateUser/:id", verifyToken, (req, res) => {
  try {

    if(!req.body.fullname){
        return res.status(400).send("full name is required to update");
    }
    if(!req.body.id){
        return res.status(400).send("id is required to update");
    }
    // sql query
    let sql = `UPDATE profiles SET 
                fullname = '${req.body.fullname}'
                WHERE id = '${req.body.id}'
                `;
    // run query
    mysqlConnection.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).send("data is updated");
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});



//######################################################## delete the user from DB#############################################################
router.delete("/deleteUser/:id", verifyToken, (req, res) => {
  try {
    // sql query
    let sql = `DELETE FROM profiles 
                WHERE id = '${req.params.id}'
                `;
    //    run query
    mysqlConnection.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).send("data is deleted");
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
