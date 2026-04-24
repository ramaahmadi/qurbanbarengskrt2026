import express from 'express';
import multer from 'multer';
import cors from 'cors';
import FormData from 'form-data';
import axios from 'axios';

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Configure multer for memory storage (we'll upload directly to imgbb)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().match(/\.[^.]+$/)[0]);
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ImgBB API key - replace with your own from https://api.imgbb.com/
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to imgbb
    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    if (response.data.success) {
      res.json({
        success: true,
        url: response.data.data.url,
        delete_url: response.data.data.delete_url
      });
    } else {
      res.status(500).json({ error: 'Failed to upload to imgbb' });
    }
  } catch (error) {
    console.error('Upload error:', error.message);
    if (error.response?.data?.error?.message) {
      res.status(500).json({ error: error.response.data.error.message });
    } else {
      res.status(500).json({ error: 'Error uploading file' });
    }
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB.' });
    }
  }
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Note: Please replace YOUR_IMGBB_API_KEY in server.js with your actual ImgBB API key from https://api.imgbb.com/');
});
