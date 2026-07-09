import Designation from '../models/Designation.js';

// 1. Naya Designation Add karna
export const addDesignation = async (req, res) => {
    try {
        const { name, department, description } = req.body;
        const newDesig = new Designation({ name, department, description });
        await newDesig.save();
        res.status(201).json({ success: true, message: "Designation Added!", designation: newDesig });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Saare Designations fetch karna (with Department Info)
export const getDesignations = async (req, res) => {
    try {
        // .populate se humein department ki ID ki jagah uska poora data milega
        const designations = await Designation.find().populate('department', 'name');
        res.status(200).json({ success: true, designations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete Designation
export const deleteDesignation = async (req, res) => {
    try {
        await Designation.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Designation Deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};