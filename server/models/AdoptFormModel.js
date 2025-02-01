import mongoose from 'mongoose';

const { Schema } = mongoose;

const adoptFormSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    livingSituation: {
        type: String,
        required: true
    },
    previousExperience: {
        type: String,
        required: true
          },
    familyComposition: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('AdoptForm', adoptFormSchema);
