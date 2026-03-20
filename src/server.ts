import 'dotenv/config';
import { app } from './app';
import mongoose from 'mongoose';

const DB = process.env.DATABASE_URL!.replace('<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => {
    console.log('DB connected successfully');
}).catch((err) => {
    console.log('DB connection failed', err);
});


app.listen(process.env.PORT!, () => {
    console.log(`Server runing on port ${process.env.PORT}`)
})