import * as mongoose from 'mongoose';

export const EmailSchema = new mongoose.Schema({
    id: String,
    from: String,
    to: Array,
    subject: String,
    text: String,
    html: String,
    sent: Boolean
});