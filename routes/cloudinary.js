const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

const { Cloudinary } = require("../models");

router.get("/", async (req, res) => {
  const cloudinary = await Cloudinary.findAll({
    attributes: ["id", "cloudinary_id", "image"],
  });

  return res.json({
    status: "success",
    data: cloudinary,
  });
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath);

    const imageUpload = await Cloudinary.create({
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });

    return res.json({
      status: "success",
      data: {
        id: imageUpload.id,
        image: result.secure_url,
      },
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const image = await Cloudinary.findByPk(id);

  if (!image) {
    return res
      .status(404)
      .json({ status: "error", message: "image not found" });
  }

  await cloudinary.uploader.destroy(image.cloudinary_id);

  await image.destroy();

  return res.json({ status: "success", message: "image deleted" });
});

module.exports = router;
