import User from '../db/models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET

export async function showRegister(req, res){
    res.render('auth/register')
}

export async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

        const errors = [];

        // Collect all validation errors
        if (!role) {
            errors.push({ field: "role", message: "Role is required." });
        }
        if (!name) {
            errors.push({ field: "name", message: "Name is required." });
        }
        if (!email) {
            errors.push({ field: "email", message: "Email is required." });
        }
        if (!password || password.length < 6) {
            errors.push({ field: "password", message: "Password must be at least 6 characters." });
        }

        // If there are errors, send them back with a 422 status (Laravel standard)
        if (errors.length > 0) {
            return res.status(422).json({ errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, role, password: hashedPassword });

        return res.status(201).json({ 
            message: 'User created successfully', 
            user: { id: user._id, username: user.username } 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Username already in use' });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(req, res){

    return res.render('auth/login')
}

export async function checkLogin(req, res) {
    try {
        const { email, password } = req.body;

        const errors = [];

        // Immediate JSON responses for validation failures
        if (!email || email.trim() === '') {
            errors.push({ field: "email", message: "Email is required." });
        }
        if (!password) {
           errors.push({ field: "password", message: "Password must be at least 6 characters." });
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

      
        const token = jwt.sign(
            { userId: user._id, is_admin: user.is_admin, name: user.name }, 
            jwtSecret, 
            { expiresIn: '5h' }
        );

        return res.status(200).json({ 
            message: 'Login successful', 
            token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export function logout(req, res){
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.status(200).json({msg: "user logged out successfully"});
}