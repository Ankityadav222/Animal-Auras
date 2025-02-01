import express from 'express';
import {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests,
    deleteApprovedOrRejectedForms,
    approvePet,
    rejectPet
    
} from '../Controller/AdoptFormController.js';

const router = express.Router();

router.post('/save', saveForm);
router.get('/getForms', getAdoptForms);
router.delete('/reject/:id', deleteForm); // Delete a single form
router.delete('/delete/many/:id', deleteAllRequests); // Delete all forms for a pet
router.delete('/delete/status/:id', deleteApprovedOrRejectedForms); // Delete approved/rejected forms based on status
router.put('/approve/:petId', approvePet); // Approve or reject a pet
// Route for rejecting a pet request
router.put('/rejecting/:petId', rejectPet); // Add this line for the reject functionality

export default router;
