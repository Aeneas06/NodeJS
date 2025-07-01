/** @format */
const { connectToDatabase } = require("../config/BP_dbConnection");

exports.addUserData = (userData, callback) => {
  const { userId, firstname, lastname, phone, address, pincode } = userData;
  const checkUserSql = `
    SELECT * FROM bpduserdata WHERE userId = ? OR phone = ?
  `;
  const values = [userId, phone];

  connectToDatabase((err, connection) => {
    if (err) return callback(err, null);

    connection.query(checkUserSql, values, (err, results) => {
      if (err) {
        connection.release();
        return callback(err, null);
      }

      if (results.length > 0) {
        connection.release();
        return callback(
          new Error("User ID or Phone number already exists"),
          null
        );
      }

      const insertSql = `
        INSERT INTO bpduserdata (userId, firstname, lastname, phone, address, pincode)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const insertValues = [
        userId,
        firstname,
        lastname,
        phone,
        address,
        pincode,
      ];

      connection.query(insertSql, insertValues, (err, result) => {
        connection.release();
        if (err) return callback(err, null);
        callback(null, result);
      });
    });
  });
};

exports.getUserData = (userId, callback) => {
  const query = `SELECT * FROM bpduserdata WHERE userId = ?`;
  connectToDatabase((err, connection) => {
    if (err) return callback(err, null);

    connection.query(query, [userId], (err, results) => {
      connection.release();
      if (err) return callback(err, null);
      if (results.length === 0) {
        return callback(new Error("No data found for the given user"), null);
      }
      callback(null, results[0]);
    });
  });
};

exports.updateUserData = (userId, userData, callback) => {
  const { firstname, lastname, phone, address, pincode } = userData;

  const checkPhoneSql = `SELECT * FROM bpduserdata WHERE phone = ? AND userId != ?`;
  const values = [phone, userId];

  connectToDatabase((err, connection) => {
    if (err) return callback(err, null);

    connection.query(checkPhoneSql, values, (err, results) => {
      if (err) {
        connection.release();
        return callback(err, null);
      }

      if (results.length > 0) {
        connection.release();
        return callback(new Error("Phone number already exists"), null);
      }

      const updateSql = `
        UPDATE bpduserdata 
        SET firstname = ?, lastname = ?, phone = ?, address = ?, pincode = ? 
        WHERE userId = ?
      `;
      const updateValues = [
        firstname,
        lastname,
        phone,
        address,
        pincode,
        userId,
      ];

      connection.query(updateSql, updateValues, (err, result) => {
        connection.release();
        if (err) return callback(err, null);
        if (result.affectedRows === 0) {
          return callback(new Error("No rows updated"), null);
        }
        callback(null, result);
      });
    });
  });
};

exports.deleteUserData = (userId, callback) => {
  const deleteSql = `DELETE FROM bpduserdata WHERE userId = ?`;
  connectToDatabase((err, connection) => {
    if (err) return callback(err, null);

    connection.query(deleteSql, [userId], (err, result) => {
      connection.release();
      if (err) return callback(err, null);
      if (result.affectedRows === 0) {
        return callback(new Error("No user found with the given userId"), null);
      }
      callback(null, result);
    });
  });
};
