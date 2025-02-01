import Pet from '../models/PetModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name and filename for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to handle posting a new pet request
const postPetRequest = async (req, res) => {
  try {
    const { name, age, area, justification, email, phone, type } = req.body;
    const filename = req.file?.filename;

    if (!filename) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      filename,
      status: 'Pending'
    });

    return res.status(200).json(pet);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Function to handle approving a pet request
const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const pet = await Pet.findByIdAndUpdate(
      id,
      { status: status || 'Approved' }, // Default status to 'Approved' if not provided
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    return res.status(200).json(pet);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Function to get all pets based on status
const allPets = async (req, res) => {
  try {
    const status = req.query.status || 'Pending';
    const data = await Pet.find({ status }).sort({ updatedAt: -1 });

    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: 'No pets found with status ' + status });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Function to handle deleting a pet post
const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const pet = await Pet.findByIdAndDelete(id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const filePath = path.join(__dirname, '../images', pet.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

      // Optionally, delete any approved forms for this pet
      await deleteApprovedOrRejectedForms(req, res);

      res.status(200).json({ message: 'Pet rejected successfully', pet });
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};


export {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets,
};
