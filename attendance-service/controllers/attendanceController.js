const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();


const clockIn = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const employeeId = req.headers['x-employee-id'];
    const userFullName = req.headers['x-user-fullname'];
    const timestamp = req.body.timestamp || new Date();

    if (!employeeId) {
        return res.status(400).json({ msg: "Employee ID not found in headers" });
    }

    if (!req.file) {
        return res.status(400).json({ msg: "Attendance photo is required" });
    }

    try {
        const photoUrl = `/uploads/${req.file.filename}`;

        const newAttendance = await prisma.attendance.create({
            data: {
                employeeId: employeeId,
                fullName: userFullName,
                timestamp: timestamp,
                photoUrl: photoUrl,
            },
        });

        res.status(201).json({ 
            msg: "Clock-in successful", 
            data: newAttendance 
        });

    } catch (error) {
        console.error('Error during clock-in:', error);
        next(error);
    }
};


const getHistory = async (req, res, next) => {
    const employeeId = req.headers['x-employee-id'];
    try {
        const history = await prisma.attendance.findMany({
            where: { employeeId: employeeId },
        });
        if (!history || history.length === 0) {
            return res.status(404).json({ msg: "Attendance records not found" });
        }
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        next(error);
    }
};


const getAllAttendance = async (_, res, next) => {
    try {
        const allAttendance = await prisma.attendance.findMany({
            orderBy: {
                timestamp: 'desc',
            },
        });
        res.status(200).json(allAttendance);
    } catch (error) {
        console.error('Error fetching all attendance records:', error);
        next(error);
    }
};

module.exports = {
    clockIn,
    getHistory,
    getAllAttendance
};