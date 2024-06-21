import mongoose, { Schema, Document } from 'mongoose';


const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;