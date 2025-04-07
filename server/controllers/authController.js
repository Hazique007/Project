import User from '../models/userSchema.js';
import generateToken from '../utils/generateToken.js';

const adminEmails = ["hazique@gmail.com", "admin2@example.com"]; // set your admin emails

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // If user doesn't exist, create one
    if (!user) {
      const role = adminEmails.includes(email) ? 'admin' : 'user';
      user = await User.create({ email, password, role });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
