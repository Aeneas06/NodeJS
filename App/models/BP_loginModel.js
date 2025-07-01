/** @format */

const { connectToDatabase } = require("../config/BP_dbConnection");

exports.findByLoginId = (loginId, callback) => {
  connectToDatabase((err, connection) => {
    if (err) return callback(err, null);

    const query =
      'SELECT loginId, userId, password, passkey, iv FROM BPDLOGIN WHERE loginId = ? AND status = "active"';
    connection.query(query, [loginId], (err, results) => {
      connection.release();
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  });
};

exports.checkLoginIdExists = (loginId, callback) => {
  connectToDatabase((err, connection) => {
    if (err) return callback(err, null);

    const query = "SELECT loginId FROM BPDLOGIN WHERE loginId = ?";
    connection.query(query, [loginId], (err, results) => {
      connection.release();
      if (err) return callback(err, null);
      callback(null, results.length > 0);
    });
  });
};
