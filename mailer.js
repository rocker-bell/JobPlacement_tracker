// const express = require("express");
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const mysql = require('mysql2');
// const uuid = require('uuid');

// // Create the express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());  // For parsing JSON bodies

// // Create a MySQL connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'admin',
//     database: 'jobconnect'
// });

// // Connect to MySQL
// db.connect((err) => {
//     if (err) {
//         console.error("Failed to connect to database:", err);
//     } else {
//         console.log("Connected to MySQL database");
//     }
// });



// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,  // Use port 587 for STARTTLS (recommended)
//   secure: false,  // Do not use SSL for port 587
//   auth: {
//     user: 'rockbell8@gmail.com',   // Replace with your email address
//     pass: 'typl seax ikxp siyt'     
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });


// // Generate random verification token
// function generateToken() {
//     return crypto.randomBytes(32).toString('hex');
// }



// // Send verification email
// function sendVerificationEmail(toEmail, username, token) {
//     const verifyLink = `http://localhost:3000/verify?token=${token}`;

//     const mailOptions = {
//         from: 'rockbell8@gmail.com',
//         to: toEmail,
//         subject: 'Verify your email address',
//         html: `
//             <h2>Hello ${username}</h2>
//             <p>Please verify your email address by clicking the link below:</p>
//             <a href="${verifyLink}">Verify Email</a>
//             <p>This link will expire in 24 hours.</p>
//         `
//     };

//     return transporter.sendMail(mailOptions);

    
// }

// // User registration route
// app.post("/register", (req, res) => {
//     const { username, email, password, telephone, role } = req.body;

//     if (!username || !email || !password || !telephone || !role) {
//         return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     const user_id = uuid.v4();  // Generate UUID for user
//     const token = generateToken();  // Generate verification token
//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

//     // Insert user into the Users table with a "Pending" account status
//     const query = `
//         INSERT INTO Utilisateurs (user_id, email, username, password_hash, telephone, role, account_status, verification_token, token_created_at, token_expires_at)
//         VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, NOW(), ?)
//     `;

//     // Hash the password for secure storage
//     const passwordHash = require('bcrypt').hashSync(password, 10);

//     db.execute(query, [user_id, email, username, passwordHash, telephone, role, token, expiresAt], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         // Send verification email to the user
//         sendVerificationEmail(email, username, token)
//             .then(() => {
//                 res.status(200).json({
//                     success: true,
//                     message: 'Registration successful. Please check your email to verify your account.'
//                 });
//             })
//             .catch((error) => {
//                 console.error(error);
//                 res.status(500).json({
//                     success: false,
//                     message: 'Failed to send verification email'
//                 });
//             });
//     });
// });

// // Email verification route
// app.get("/verify", (req, res) => {
//     const { token } = req.query;

//     if (!token) {
//         return res.status(400).json({ success: false, message: 'No token provided' });
//     }

//     // Verify the token and update user account status
//     const query = `
//         SELECT * FROM Utilisateurs WHERE verification_token = ? AND token_expires_at > NOW() AND token_used = 0
//     `;

//     db.execute(query, [token], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         if (results.length === 0) {
//             return res.status(400).json({ success: false, message: 'Invalid or expired token' });
//         }

//         const user = results[0];

//         // Mark the token as used and update the account status to 'Verified'
//         const updateQuery = `
//             UPDATE Utilisateurs 
//             SET account_status = 'Verified', token_used = 1
//             WHERE user_id = ?
//         `;

//         db.execute(updateQuery, [user.user_id], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ success: false, message: 'Failed to update account status' });
//             }

//             res.status(200).json({
//                 success: true,
//                 message: 'Your email has been verified. You can now log in.'
//             });
//         });
//     });
// });

// app.post("/resend-verification", (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: "Email is required"
//     });
//   }

//   // Find user
//   const findQuery = `
//     SELECT user_id, username, account_status 
//     FROM Utilisateurs
//     WHERE email = ?
//   `;

//   db.execute(findQuery, [email], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No account found with this email"
//       });
//     }

//     const user = results[0];

//     if (user.account_status === "Verified") {
//       return res.status(400).json({
//         success: false,
//         message: "Account already verified"
//       });
//     }

//     // Generate new token
//     const token = generateToken();
//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

//     const updateQuery = `
//       UPDATE Utilisateurs
//       SET verification_token = ?, 
//           token_created_at = NOW(),
//           token_expires_at = ?, 
//           token_used = 0
//       WHERE user_id = ?
//     `;

//     db.execute(updateQuery, [token, expiresAt, user.user_id], (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({
//           success: false,
//           message: "Failed to update verification token"
//         });
//       }

//       // Send email
//       sendVerificationEmail(email, user.username, token)
//         .then(() => {
//           res.json({
//             success: true,
//             message: "Verification email resent successfully"
//           });
//         })
//         .catch((error) => {
//           console.error(error);
//           res.status(500).json({
//             success: false,
//             message: "Failed to send verification email"
//           });
//         });
//     });
//   });
// });



// const sendVerificationEmailOTP = async (email, otp) => {
    
//   const mailOptions = {
//     from: "rockbell8@gmail.com", // Replace with your email
//     to: email,
//     subject: "Password Recovery OTP",
//     html: `
//       <h2>Password Recovery OTP</h2>
//       <p>Your OTP for password recovery is: <strong>${otp}</strong></p>
//       <p>This OTP is valid for 10 minutes.</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("OTP sent successfully to:", email);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Failed to send OTP");
//   }
// };

// // app.post("/send-otp", (req, res) => {
// //   const { email } = req.body;


    
// //   // Update the user record with the OTP
// //   const query = "UPDATE Utilisateurs SET otp = ?, otp_created_at = NOW() WHERE email = ?";
// //   db.query(query, [otp, email], (err, result) => {
// //     if (err) {
// //       return res.status(500).json({ success: false, message: "Database error." });
// //     }

// //     if (result.affectedRows === 0) {
// //       return res.status(404).json({ success: false, message: "Email not found." });
// //     }

// //     // Send OTP email
// //    sendVerificationEmailOTP(email, otp)
// // })

// // })


// // Verify OTP route
// // app.post("/verify-otp", (req, res) => {
// //   const { email, otp } = req.body;

// //   // Fetch the stored OTP and its creation time
// //   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
// //   db.query(query, [otp, email], (err, results) => {
// //     if (err) {
// //       return res.status(500).json({ success: false, message: "Database error." });
// //     }

// //     if (results.length === 0) {
// //       return res.status(404).json({ success: false, message: "Email not found." });
// //     }

// //     const { storedOtp: otp, otp_created_at } = results[0];

// //     // Check if OTP matches
// //     if (storedOtp !== otp) {
// //       return res.status(400).json({ success: false, message: "Invalid OTP." });
// //     }

// //     // Check if OTP expired (e.g., 5 minutes expiration)
// //     const otpAge = (new Date() - new Date(otp_created_at)) / 1000; // in seconds
// //     if (otpAge > 300) { // OTP expiration time (5 minutes)
// //       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
// //     }

// //     // OTP is valid and not expired
// //     res.status(200).json({ success: true, message: "OTP verified." });
// //   });
// // });




// // Reset password route

// app.post("/send-otp", (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ success: false, message: "Email is required." });

//   const otp = generateOTP(); // generate OTP

//   // Update the user record with the OTP
//   const query = "UPDATE Utilisateurs SET otp = ?, otp_created_at = NOW() WHERE email = ?";
//   db.query(query, [otp, email], async (err, result) => {
//     if (err) return res.status(500).json({ success: false, message: "Database error." });
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Email not found." });

//     try {
//       await sendVerificationEmailOTP(email, otp);
//       res.status(200).json({ success: true, message: "OTP sent successfully." });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Failed to send OTP." });
//     }
//   });
// });




// app.post("/reset-password", (req, res) => {
//   const { email, newPassword } = req.body;

//   // Hash the new password before storing it
//   const hashedPassword = bcrypt.hashSync(newPassword, 10);

//   // Update the user's password in the database
//   const query = "UPDATE Utilisateurs SET password_hash = ? WHERE email = ?";
//   db.query(query, [hashedPassword, email], (err, result) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     res.status(200).json({ success: true, message: "Password successfully reset." });
//   });
// });



// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require("express");
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const uuid = require('uuid');

// Create the express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // For parsing JSON bodies

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'jobconnect'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Failed to connect to database:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,  // Use port 587 for STARTTLS (recommended)
  secure: false,  // Do not use SSL for port 587
  auth: {
    user: 'rockbell8@gmail.com',   // Replace with your email address
    pass: 'typl seax ikxp siyt'   // Replace with your email password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Generate OTP
function generateOTP() {
  // Return a 6-digit OTP as string
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email
const sendVerificationEmailOTP = async (email, otp) => {
  const mailOptions = {
    from: "rockbell8@gmail.com", // Replace with your email
    to: email,
    subject: "Password Recovery OTP",
    html: `
      <h2>Password Recovery OTP</h2>
      <p>Your OTP for password recovery is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

// Generate random verification token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}



// Send verification email
function sendVerificationEmail(toEmail, username, token) {
    const verifyLink = `http://localhost:3000/verify?token=${token}`;

    const mailOptions = {
        from: 'rockbell8@gmail.com',
        to: toEmail,
        subject: 'Verify your email address',
        html: `
            <h2>Hello ${username}</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verifyLink}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
        `
    };

    return transporter.sendMail(mailOptions);

    
}

// User registration route
app.post("/register", (req, res) => {
    const { username, email, password, telephone, role } = req.body;

    if (!username || !email || !password || !telephone || !role) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const user_id = uuid.v4();  // Generate UUID for user
    const token = generateToken();  // Generate verification token
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Insert user into the Users table with a "Pending" account status
    const query = `
        INSERT INTO utilisateurs 
        (user_id, email, username, password_hash, telephone, role, account_status, verification_token, token_created_at, token_expires_at) 
        VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, NOW(), ?)
    `;

    // Hash the password for secure storage
    const passwordHash = require('bcrypt').hashSync(password, 10);

    db.execute(query, [user_id, email, username, passwordHash, telephone, role, token, expiresAt], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Send verification email to the user
        sendVerificationEmail(email, username, token)
            .then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Registration successful. Please check your email to verify your account.'
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to send verification email'
                });
            });
    });
});

// Email verification route
app.get("/verify", (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: 'No token provided' });
    }

    // Verify the token and update user account status
    const query = `
        SELECT * FROM Utilisateurs WHERE verification_token = ? AND token_expires_at > NOW() AND token_used = 0
    `;

    db.execute(query, [token], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const user = results[0];

        // Mark the token as used and update the account status to 'Verified'
        const updateQuery = `
            UPDATE Utilisateurs 
            SET account_status = 'Verified', token_used = 1
            WHERE user_id = ?
        `;

        db.execute(updateQuery, [user.user_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Failed to update account status' });
            }

            res.status(200).json({
                success: true,
                message: 'Your email has been verified. You can now log in.'
            });
        });
    });
});


app.post("/resend-verification", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  // Find user
  const findQuery = `
    SELECT user_id, username, account_status 
    FROM Utilisateurs
    WHERE email = ?
  `;

  db.execute(findQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email"
      });
    }

    const user = results[0];

    if (user.account_status === "Verified") {
      return res.status(400).json({
        success: false,
        message: "Account already verified"
      });
    }

    // Generate new token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const updateQuery = `
      UPDATE Utilisateurs
      SET verification_token = ?, 
          token_created_at = NOW(),
          token_expires_at = ?, 
          token_used = 0
      WHERE user_id = ?
    `;

    db.execute(updateQuery, [token, expiresAt, user.user_id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to update verification token"
        });
      }

      // Send email
      sendVerificationEmail(email, user.username, token)
        .then(() => {
          res.json({
            success: true,
            message: "Verification email resent successfully"
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            message: "Failed to send verification email"
          });
        });
    });
  });
});




// Route to send OTP
// app.post("/send-otp", (req, res) => {
//   const { email } = req.body;

//   if (!email) return res.status(400).json({ success: false, message: "Email is required." });

//   const otp = generateOTP(); // generate OTP

//   // Update the user record with the OTP
//   const query = "UPDATE Utilisateurs SET otp = ?, otp_created_at = NOW() WHERE email = ?";
//   db.query(query, [otp, email], async (err, result) => {
//     if (err) return res.status(500).json({ success: false, message: "Database error." });
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Email not found." });

//     try {
//       await sendVerificationEmailOTP(email, otp);
//       res.status(200).json({ success: true, message: "OTP sent successfully." });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Failed to send OTP." });
//     }
//   });
// });


app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required." });

  const otp = generateOTP(); // Generate a new OTP

  // Update the user record with the OTP in the database
  const query = "UPDATE Utilisateurs SET otp = ?, otp_created_at = NOW() WHERE email = ?";
  db.query(query, [otp, email], async (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error." });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Email not found." });

    try {
      await sendVerificationEmailOTP(email, otp);  // Send OTP to user's email
      res.status(200).json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
  });
});


// Verify OTP route
// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

//   // Fetch the stored OTP and its creation time
//   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     const { otp: storedOtp, otp_created_at } = results[0];

//     // Check if OTP matches
//     if (storedOtp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }

//     // Check if OTP expired (e.g., 10 minutes expiration)
//     const otpAge = (new Date() - new Date(otp_created_at)) / 1000; // in seconds
//     if (otpAge > 600) { // OTP expiration time (10 minutes)
//       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
//     }

//     // OTP is valid and not expired
//     res.status(200).json({ success: true, message: "OTP verified." });
//   });
// });


// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

//   // Fetch the stored OTP and its creation time
//   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     const { otp: storedOtp, otp_created_at } = results[0];

//     console.log("Stored OTP: ", storedOtp);  // Log stored OTP
//     console.log("Entered OTP: ", otp);      // Log entered OTP

//     // Compare OTPs
//     if (storedOtp.trim() !== otp.trim()) {
//       return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }

//     // Check if OTP expired (e.g., 10 minutes expiration)
//     const otpAge = (new Date() - new Date(otp_created_at)) / 1000; // in seconds
//     if (otpAge > 600) { // OTP expiration time (10 minutes)
//       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
//     }

//     // OTP is valid and not expired
//     res.status(200).json({ success: true, message: "OTP verified." });

//     // Optionally, invalidate OTP after verification
//     const updateQuery = "UPDATE Utilisateurs SET otp = NULL, otp_created_at = NULL WHERE email = ?";
//     db.query(updateQuery, [email], (err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("OTP invalidated after successful verification.");
//       }
//     });
//   });
// });


// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   // Fetch the stored OTP and its creation time
//   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     const { otp: storedOtp, otp_created_at } = results[0];

//     // Check if OTP matches
//     if (storedOtp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }

//     // Check if OTP expired (10 minutes)
//     const otpAge = (new Date() - new Date(otp_created_at)) / 1000; // in seconds
//     if (otpAge > 600) { // 600 seconds = 10 minutes
//       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
//     }

//     // OTP is valid
//     res.status(200).json({ success: true, message: "OTP verified." });
//   });
// });

// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

//   // Fetch the stored OTP and its creation time
//   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     const { otp: storedOtp, otp_created_at } = results[0];

//     // Compare OTPs
//     if (storedOtp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }

//     // Check if OTP expired (e.g., 10 minutes expiration)
//     const otpAge = (new Date() - new Date(otp_created_at)) / 1000; // in seconds
//     if (otpAge > 600) { // OTP expiration time (10 minutes)
//       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
//     }

//     // OTP is valid and not expired
//     res.status(200).json({ success: true, message: "OTP verified." });

//     // Optionally, invalidate OTP after successful verification
//     const updateQuery = "UPDATE Utilisateurs SET otp = NULL, otp_created_at = NULL WHERE email = ?";
//     db.query(updateQuery, [email], (err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("OTP invalidated after successful verification.");
//       }
//     });
//   });
// });


// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, message: "Email and OTP are required." });
//   }

//   console.log("Received email:", email); // Log received email
//   console.log("Received OTP:", otp); // Log received OTP

//   // Fetch the stored OTP and its creation time
//   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     const { otp: storedOtp, otp_created_at } = results[0];

//       const otpCreatedAt = new Date(otp_created_at);
//         const currentTime = new Date();


//     console.log("Stored OTP in DB:", storedOtp); // Log the stored OTP
//     console.log("Stored OTP created at:", otp_created_at); // Log stored creation time

  
//         // Log for debugging
//         console.log("Current Time:", currentTime);
//         console.log("OTP Created At:", otpCreatedAt);

//     // Compare OTPs
//     if (storedOtp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }

//     // Check if OTP expired (e.g., 10 minutes expiration)
//     const otpAge = (new Date() - new Date(otp_created_at)) / 1000; // in seconds
//     console.log("OTP age (in seconds):", otpAge); // Log OTP age
//     if (otpAge > 600) { // OTP expiration time (10 minutes)
//       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
//     }

//     // OTP is valid and not expired
//     res.status(200).json({ success: true, message: "OTP verified." });

//     // Optionally, invalidate OTP after successful verification
//     const updateQuery = "UPDATE Utilisateurs SET otp = NULL, otp_created_at = NULL WHERE email = ?";
//     db.query(updateQuery, [email], (err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("OTP invalidated after successful verification.");
//       }
//     });
//   });
// });


// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, message: "Email and OTP are required." });
//   }

//   console.log("Received email:", email); // Log received email
//   console.log("Received OTP:", otp); // Log received OTP

//   // Fetch the stored OTP and its creation time
//   const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Database error." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found." });
//     }

//     const { otp: storedOtp, otp_created_at } = results[0];

//     // Trim both the stored OTP and the OTP received to avoid extra spaces
//     const trimmedStoredOtp = storedOtp.trim();
//     const trimmedReceivedOtp = otp.trim();

//     // Log both OTPs for debugging
//     console.log("Trimmed Stored OTP:", trimmedStoredOtp);
//     console.log("Trimmed Received OTP:", trimmedReceivedOtp);

//     // Compare OTPs
//     if (trimmedStoredOtp !== trimmedReceivedOtp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }

//     // Handle OTP expiry
//     const otpCreatedAt = new Date(otp_created_at);
//     const currentTime = new Date();

//     console.log("Stored OTP created at:", otpCreatedAt); // Log stored creation time
//     console.log("Current Time:", currentTime); // Log current time

//     // Calculate the age of the OTP (in seconds)
//     const otpAgeInSeconds = (currentTime - otpCreatedAt) / 1000;

//     console.log("OTP age (in seconds):", otpAgeInSeconds);

//     if (otpAgeInSeconds > 600) { // OTP expiration time (10 minutes)
//       return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
//     }

//     // OTP is valid and not expired
//     res.status(200).json({ success: true, message: "OTP verified." });

//     // Optionally, invalidate OTP after successful verification
//     const updateQuery = "UPDATE Utilisateurs SET otp = NULL, otp_created_at = NULL WHERE email = ?";
//     db.query(updateQuery, [email], (err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("OTP invalidated after successful verification.");
//       }
//     });
//   });
// });


app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  console.log("Received email:", email); // Log received email
  console.log("Received OTP:", otp); // Log received OTP

  // Fetch the stored OTP and its creation time
  const query = "SELECT otp, otp_created_at FROM Utilisateurs WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    let { otp: storedOtp, otp_created_at } = results[0];

    // Check if OTP is null or not a string
    if (storedOtp == null || typeof storedOtp !== 'string') {
      storedOtp = String(storedOtp); // Convert to string if not already
    }

    // Trim both the stored OTP and the OTP received to avoid extra spaces
    const trimmedStoredOtp = storedOtp.trim();
    const trimmedReceivedOtp = otp.trim();

    // Log both OTPs for debugging
    console.log("Trimmed Stored OTP:", trimmedStoredOtp);
    console.log("Trimmed Received OTP:", trimmedReceivedOtp);

    // Compare OTPs
    if (trimmedStoredOtp !== trimmedReceivedOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Handle OTP expiry
    const otpCreatedAt = new Date(otp_created_at);
    const currentTime = new Date();

    console.log("Stored OTP created at:", otpCreatedAt); // Log stored creation time
    console.log("Current Time:", currentTime); // Log current time

    // Calculate the age of the OTP (in seconds)
    const otpAgeInSeconds = (currentTime - otpCreatedAt) / 1000;

    console.log("OTP age (in seconds):", otpAgeInSeconds);

    if (otpAgeInSeconds > 100000) { // OTP expiration time (10 minutes)
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
    }

    // OTP is valid and not expired
    res.status(200).json({ success: true, message: "OTP verified." });

    // Optionally, invalidate OTP after successful verification
    const updateQuery = "UPDATE Utilisateurs SET otp = NULL, otp_created_at = NULL WHERE email = ?";
    db.query(updateQuery, [email], (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("OTP invalidated after successful verification.");
      }
    });
  });
});



// Reset password route
app.post("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password are required." });
  }

  // Hash the new password before storing it
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Update the user's password in the database
  const query = "UPDATE Utilisateurs SET password_hash = ? WHERE email = ?";
  db.query(query, [hashedPassword, email], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    res.status(200).json({ success: true, message: "Password successfully reset." });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
