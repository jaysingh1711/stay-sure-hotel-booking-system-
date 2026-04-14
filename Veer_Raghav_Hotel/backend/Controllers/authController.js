import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
 
// Register Function
export const register = async (req, res) => {
  const { name, email, password, phoneno, gender, age, role } = req.body;
 
  try {
    // Input validation
    if (!name || !email || !password || !phoneno) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and phone number are required."
      });
    }
 
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { phoneno }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email or phone number already exists."
      });
    }
 
    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
 
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneno,
      gender,
      age,
      role
    });
 
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        name: newUser.name,
        email: newUser.email,
        phoneno: newUser.phoneno,
        gender: newUser.gender,
        age: newUser.age
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};
 
// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Trim and normalize email and password
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Find user by email
    const user = await User.findOne({ email: trimmedEmail });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "User not found or password is missing."
      });
    }

    // Debugging log
    // console.log('User found:', user);
    // console.log('Stored hashed password:', user.password);

    // Check password match
    const isMatch = await bcryptjs.compare(trimmedPassword, user.password);

// console.log('Password comparison:');
// console.log('Plain password:', trimmedPassword);
// console.log('Hashed password from DB:', user.password);
// console.log('Comparison result:', isMatch); // This should log `true` if passwords match.


    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Password is incorrect."
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '5h' }
    );

    // Set cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneno: user.phoneno,
        gender: user.gender,
        age: user.age,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};


export const logout = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict'
    });
    return res.status(200).json({
      success: true,
      message: "Logout successful."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};
