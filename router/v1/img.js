import express from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

import { s3Client } from "../../db/aws.js";
import { getS3Pragmas } from "../../utils/s3Utils.js";

const router = express.Router();

router.get("/:folder/:id", async (req, res, next) => {
  try {
    const { id, folder } = req.params;

    if (!id) return res.status(400).send();

    const command = new GetObjectCommand(getS3Pragmas(`${folder}/${id}`));
    const response = await s3Client.send(command);

    res.set("Content-Type", response.ContentType || "application/octet-stream");
    res.set("Content-Length", response.ContentLength?.toString() || "");
    res.set("Last-Modified", response.LastModified?.toUTCString() || "");
    res.set("ETag", response.ETag || "");
    res.set("Cache-Control", "public, max-age=31536000"); // cache for 1 year

    // Check if Body exists and is a readable stream
    if (response.Body) {
      const bodyStream = Readable.from(response.Body); // Convert response.Body to a Node.js readable stream
      bodyStream.pipe(res); // Stream the content to the response
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
