import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({
            email,
        });

        if (exists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    res.json(req.user);
};


export const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        message: "Logged Out Successfully",
    });
};



export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters long.",
            });
        }

        // Get logged-in user
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect.",
            });
        }

        // Prevent using same password
        const isSamePassword = await user.matchPassword(newPassword);

        if (isSamePassword) {
            return res.status(400).json({
                message: "New password cannot be the same as the current password.",
            });
        }

        // Update password
        user.password = newPassword;

        // pre("save") middleware will hash the password
        await user.save();

        res.status(200).json({
            message: "Password changed successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};