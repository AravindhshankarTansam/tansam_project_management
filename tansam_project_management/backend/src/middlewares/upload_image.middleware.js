import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/po";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `PO_${Date.now()}${ext}`;
    cb(null, name);
  },
});

// Accept only image files for signature/seal
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files are allowed for signature/seal"));
};

export const uploadPO = multer({ storage, fileFilter });
