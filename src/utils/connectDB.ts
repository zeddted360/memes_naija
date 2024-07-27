import mongoose from 'mongoose';

export const connectDB = async () => {
    let connect = { isConnected:'' };
    
    if (connect.isConnected === 'connected') {
        console.log('db already connected')
    } else {
        try {
            const connection = await mongoose.connect(process.env.MONGO_URL || '');
            connect.isConnected = 'connected';
            console.log('db ', connect.isConnected);
            return connection;
        } catch (error:any) {
            console.log(error.message);
        }
    }
}