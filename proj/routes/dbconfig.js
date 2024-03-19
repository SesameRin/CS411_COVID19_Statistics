// config parameters to Data Base

const DB_CONFIG = {
    DB_HOST_IP : '34.172.9.213',
    DB_USR : 'root',
    DB_PSW : '321321',
    SECRETKEY : 'mySecretKey'
};

const jwt = require('jsonwebtoken');


/**
 * Checks if a JWT token is valid for a given user.
 * @param {string} token - The JWT token to verify.
 * @param {string} username - The username of the user that the token should belong to.
 * @returns {boolean} - True if the token is valid for the given user, false otherwise.
 */
function isSignatureValid(token, username) {
    const secretKey = DB_CONFIG.SECRETKEY;
  
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          reject(false);
        } else if (decoded.username !== username) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

module.exports = {
    DB_CONFIG : DB_CONFIG,
    isSignatureValid : isSignatureValid
};


