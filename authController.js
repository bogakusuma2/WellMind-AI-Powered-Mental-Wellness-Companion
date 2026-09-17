const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

// Register
const register = async (req, res) => {
  const { first_name, last_name, date_of_birth, gender,
          email, phone_number, password, user_type_id } = req.body;

  if (!first_name || !last_name || !email || !password || !user_type_id) {
    return res.status(400).json({ error: 'Please fill all mandatory fields.' });
  }

  try {
    // Check if email already exists
    const existing = await pool.query(
      'SELECT user_id FROM "user" WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO "user"
        (first_name, last_name, date_of_birth, gender,
         email, phone_number, password, user_type_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Active')
       RETURNING user_id, first_name, last_name, email, user_type_id`,
      [first_name, last_name, date_of_birth, gender,
       email, phone_number, hashedPassword, user_type_id]
    );

    res.status(201).json({
      message: 'Registration successful.',
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // ─── Debug ──────────────────────────────────────────────────────────────
  console.log('========== LOGIN REQUEST ==========');
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM "user" WHERE email = $1', [email]
    );

    // ─── Debug ──────────────────────────────────────────────────────────
    console.log('Users Found:', result.rows.length);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const user = result.rows[0];

    // ─── Debug ────────────────────────────────────────────────────────────
    console.log('User Email:', user.email);

    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Your account is inactive. Contact your admin.' });
    }

    // ─── Debug ────────────────────────────────────────────────────────────
    console.log('Comparing Password');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    // ─── Debug ────────────────────────────────────────────────────────────
    console.log('Password Match');
    console.log('Generating Token');

    const token = jwt.sign(
      { user_id: user.user_id, user_type_id: user.user_type_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ─── Debug ────────────────────────────────────────────────────────────
    console.log('Sending Success Response');

    res.json({
      message: 'Login successful.',
      token,
      user: {
        user_id:      user.user_id,
        first_name:   user.first_name,
        last_name:    user.last_name,
        email:        user.email,
        user_type_id: user.user_type_id,
      }
    });
  } catch (err) {
    // ─── Debug ──────────────────────────────────────────────────────────
    console.log('========== LOGIN SERVER ERROR ==========');
    console.error(err);

    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };