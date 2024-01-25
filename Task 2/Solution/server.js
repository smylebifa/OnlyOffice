const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));


app.get("/", function (_, response) {
    response.sendFile(__dirname + "/index.html");
});

const jsonData = {
    "async": false,
    "filetype": "docx",
    "key": "Khirz6zTPdfd7",
    "outputtype": "pdf",
    "title": "sample.docx",
    "url": "http://localhost/example/files/__1/sample.docx"

};

const url = 'http://localhost/ConvertService.ashx';

app.post('/upload', upload.single('document'), async (req, res) => {
    try {
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData)
      });

        console.log(response);

        let pdfBuffer = Buffer.from(response.data, 'binary');
        let pdfPath = 'public/file.pdf';
        
        fs.writeFileSync(pdfPath, pdfBuffer);

        res.download(pdfPath, 'converted_document.pdf', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                fs.unlinkSync(pdfPath); // Delete the temporary PDF file
            }
        });
    }

    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

