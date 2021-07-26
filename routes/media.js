const express = require("express");
const router = express.Router();
const isBase64 = require("is-base64");
const base64Img = require("base64-img");

const fs = require("fs");

const { Media } = require("../models");
const route = require("color-convert/route");

const { HOSTNAME } = process.env;

router.get("/", async (req, res) => {
  const media = await Media.findAll({
    attributes: ["id", "image"],
  });

  const mappedMedia = media.map((item) => {
    item.image = `${HOSTNAME}/${item.image}`;
    return item;
  });

  return res.json({
    status: "success",
    data: mappedMedia,
  });
});

router.post("/", (req, res) => {
  const image = req.body.image;

  if (!isBase64(image, { mimeRequired: true })) {
    return res
      .status(400)
      .json({ status: "error", message: "invalide base64" });
  }

  base64Img.img(
    image,
    "./public/images",
    Date.now(),
    async (error, filepath) => {
      if (error) {
        return res
          .status(400)
          .json({ status: "error", message: error.message });
      }

      // only on windows
      const filename = filepath.split("\\").pop().split("/").pop();

      // const filename = filepath.split("/").pop();

      const media = await Media.create({ image: `images/${filename}` });

      return res.json({
        status: "success",
        data: {
          id: media.id,
          image: `${HOSTNAME}/images/${filename}`,
        },
      });
    }
  );
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const media = await Media.findByPk(id);

  if (!media)
    res.status(404).json({ status: "error", message: "media not found" });

  fs.unlink(`./public/${media.image}`, async (error) => {
    if (error)
      res.status(400).json({ status: "error", message: error.message });

    await media.destroy();

    return res.json({ status: "success", message: "image deleted" });
  });
});

module.exports = router;
