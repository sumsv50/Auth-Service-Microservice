import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import {v2} from 'cloudinary';

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: async (req, file) => {
    const currentDate:Date = new Date();
    const timestamp:number = currentDate.getTime();
    const fileNameWithExtensionNameRemoved:string = file.originalname.replace(/\.[^/.]+$/, "");
    return {
      folder: 'DEV',
      format: 'png', // supports promises as well
      public_id: fileNameWithExtensionNameRemoved+"_"+timestamp.toString(),
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-call

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, process.cwd()+'/src/public/images/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })

const upload = multer({ storage: storage }) 

export default upload;

