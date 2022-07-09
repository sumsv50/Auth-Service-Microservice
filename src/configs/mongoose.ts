const mongoose = require('mongoose');

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connection successful');
  } catch (e) {
    console.log('connection error')
  }
}

export default dbConnect;