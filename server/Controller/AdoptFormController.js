import AdoptForm from '../models/AdoptFormModel.js';
import Pet from '../models/PetModel.js'; // Import your pet model

// Save form submission
const saveForm = async (req, res) => {
    try {
        const { email, livingSituation, phoneNo, previousExperience, familyComposition, petId } = req.body;
        const form = await AdoptForm.create({
            email,
            livingSituation,
            phoneNo,
            previousExperience,
            familyComposition,
            petId,
            status: 'pending' // Default status as 'pending'
        });

        res.status(200).json(form);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all adoption forms
const getAdoptForms = async (req, res) => {
    try {
        const forms = await AdoptForm.find().sort({ createdAt: -1 });
        res.status(200).json(forms);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete single form by ID
const deleteForm = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await AdoptForm.findByIdAndDelete(id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete all forms related to a specific pet (by petId)
const deleteAllRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdoptForm.deleteMany({ petId: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No forms found for this pet ID' });
        }
        res.status(200).json({ message: 'Forms deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete only approved/rejected forms by petId
const deleteApprovedOrRejectedForms = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query; // Check for 'approved' or 'rejected' status

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided. Use "approved" or "rejected".' });
        }

        const result = await AdoptForm.deleteMany({ petId: id, status });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `No ${status} forms found for this pet ID` });
        }

        res.status(200).json({ message: `${status} forms deleted successfully` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Approve or reject a pet by updating the form status
const approvePet = async (req, res) => {
    const { petId } = req.params;
    const { email, phone, status } = req.body;

    try {
        // Update pet information
        const pet = await Pet.findByIdAndUpdate(petId, { email, phone, status }, { new: true });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Optionally, update the adoption form status (if status is 'approved' or 'rejected')
        await AdoptForm.updateMany({ petId }, { status });

        res.status(200).json(pet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};





// Reject a pet by updating the form status
const rejectPet = async (req, res) => {
    const { petId } = req.params; // Get petId from the request parameters

    try {
        // Update pet information to set status to 'rejected'
        const pet = await Pet.findByIdAndUpdate(petId, { status: 'rejected' }, { new: true });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Call the delete function with the status as a query parameter
        req.query.status = 'rejected'; // Set the status to 'rejected'
        await deleteApprovedOrRejectedForms(req, res); // Pass req to the function

        res.status(200).json({ message: 'Pet rejected successfully', pet });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};






export {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests,
    deleteApprovedOrRejectedForms,


    approvePet,
    rejectPet
};
