const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllEmployees = async (_, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const employee = await prisma.employee.create({
            data: req.body,
        });
        res.status(201).json(employee);
    } catch (error) {
        console.error('Error creating employee:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.employee.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    createEmployee
};