import { v2 as cloudinary } from 'cloudinary';

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: 'dfyaergf4',
    api_key: '588228196184654',
    api_secret: 'vPWxQTN6e9bJLwjPDpp7H-RuRjo',
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
      }
    )
    .catch((error) => {
      console.log(error);
      return null;
    });

  console.log('uploadResult:', uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url('shoes', {
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log('optimizeUrl:', optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url('shoes', {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  console.log('autoCropUrl:', autoCropUrl);
})();

