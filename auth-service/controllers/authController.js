const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_blabla_bla_secret';


const register = async (req, res) => {
    const { email, password, fullName, employeeId, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                employeeId,
                fullName,
                role,
            },
        });
        res.status(201).json({ msg: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ msg: 'Error registering user', error: error.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                employeeId: user.employeeId,
                fullName: user.fullName,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
            path: '/',
            domain: 'localhost'
        });

        res.status(200).json({ 
            msg: 'Login successful', 
            token: token,
            user: {
                userId: user.id,
                email: user.email,
                employeeId: user.employeeId,
                fullName: user.fullName,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login
};