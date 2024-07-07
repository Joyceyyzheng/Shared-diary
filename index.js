const express = require("express");
const path = require("path");
const multer = require("multer");
tw

const app = express();
const port = process.env.PORT || 3000;
const { uploadImage } = require("./uploadHelper.js");

// Set up static file serving from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
});
console.log(Client);
const client = new Client();

// API endpoint for listing the current images
app.post("/api/listPosts", upload.single("image-upload"), async (req, res) => {
  console.log("req = " + req);

  let userUploadedFileUrlsKey = `uploaded_file_urls_global`;
  let urls = (await client.get(userUploadedFileUrlsKey)).value;
  if (urls === undefined) {
    urls = [];
  }

  // must convert array to a JSON string before sending as http
  res.status(200).contentType("text/json").end(JSON.stringify(urls));
});

app.post(
  "/api/uploadImage",
  upload.single("image-upload"),
  async (req, res) => {
    const uuid = Math.random().toString().slice(2, 12);
    try {
      let imageUrl;
      if (req.file) {
        imageUrl = await uploadImage(
          req.file,
          uuid + "-" + req.file.originalname + ".png",
        );
      }
      // Username specific key in the database
      //shared diary would be the same name
      let userUploadedFileUrlsKey = `uploaded_file_urls_global`;

      // Retrieve current URLs for this user
      let keyData = await client.get(userUploadedFileUrlsKey);
      console.log("userUploadedFileUrlsKey = " + userUploadedFileUrlsKey);
      let userUrlsJson = keyData.value;
      let currentUrls = userUrlsJson ? userUrlsJson : [];
      console.log("userUrlsJson = " + userUrlsJson);
      // Add new URL and save back to the database
      let post = {
        url: imageUrl,
        text: req.body.text, //or just req.text
        date: new Date().toISOString(),
        _name: "sent by: " + req.body._name,
      };
      console.log(post);
      //currentUrls.push(imageUrl);
      currentUrls.push(post);
      await client.set(userUploadedFileUrlsKey, currentUrls);

      res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Oops! Something went wrong.");
    }
  },
);

// Enable entries to be draggable
// app.get('/draggable.js', (req, res) => {
//   res.type('.js');
//   res.send(`
//     document.addEventListener('DOMContentLoaded', function() {
//       const makeDraggable = (elem) => {
//         elem.setAttribute('draggable', true);
//         let startX, startY, initialX, initialY;
//         const dragStart = (e) => {
//           startX = e.clientX - initialX;
//           startY = e.clientY - initialY;
//           document.addEventListener('mousemove', drag);
//           document.addEventListener('mouseup', dragEnd);
//         };
//         const drag = (e) => {
//           initialX = e.clientX - startX;
//           initialY = e.clientY - startY;
//           elem.style.transform = 'translate(' + initialX + 'px, ' + initialY + 'px)';
//         };
//         const dragEnd = () => {
//           document.removeEventListener('mousemove', drag);
//           document.removeEventListener('mouseup', dragEnd);
//         };
//         elem.addEventListener('mousedown', (e) => {
//           initialX = elem.offsetLeft;
//           initialY = elem.offsetTop;
//           dragStart(e);
//         });
//       };
//       document.querySelectorAll('.entry').forEach(makeDraggable);
//     });
//   `);
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//clean the data
// client.delete(`uploaded_file_urls_global`).then(() => {});
