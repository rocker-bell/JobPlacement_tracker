const express = require("express");
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mysql = require('mysql2');
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
    user: '',   // Replace with your email address
    pass: ''        
  },
  tls: {
    rejectUnauthorized: false,
  },
});


// Generate random verification token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Send verification email
function sendVerificationEmail(toEmail, username, token) {
    const verifyLink = `http://localhost:5173/verify?token=${token}`;

    const mailOptions = {
        from: '',
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
        INSERT INTO Utilisateurs_ (user_id, email, username, password_hash, telephone, role, account_status, verification_token, token_created_at, token_expires_at)
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
        SELECT * FROM Utilisateurs_ WHERE verification_token = ? AND token_expires_at > NOW() AND token_used = 0
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
            UPDATE Utilisateurs_ 
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
