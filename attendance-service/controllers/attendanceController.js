const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const clockIn = async (req, res) => {
    const employeeId = req.headers['x-employee-id'];
    const userFullName = req.headers['x-user-fullname'];
    const timestamp = req.body.timestamp || new Date();

    if (!employeeId) {
        return res.status(400).json({ msg: "Employee ID not found in headers" });
    }
    console.log('Received file:', req.file);
    console.log('Request body:', req.body);
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
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

const getAllAttendance = async (_, res) => {
    try {
        const allAttendance = await prisma.attendance.findMany({
            orderBy: {
                timestamp: 'desc',
            },
        });
        res.status(200).json(allAttendance);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = {
    clockIn,
    getAllAttendance,
};