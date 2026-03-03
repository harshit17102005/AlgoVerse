import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String }
});

userSchema.pre('save', async function (this: any) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('TestUser', userSchema);

async function run() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test_kareem_error');
    await User.deleteMany({});
    const user = new User({ email: 'test@test.com', password: 'password123' });
    try {
        await user.save();
        console.log('Saved successfully');
    } catch (err: any) {
        console.error('Error:', err.stack);
    }
    await mongoose.disconnect();
}

run();
