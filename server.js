const express = require('express')
const getData = require('./exceldata/getdata')
const DB = require('./middlewares/db')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const reader = require('xlsx')
const fs=require("fs");
const app = express()
const ejs=require("ejs");
const puppeteer=require("puppeteer")
const { sendEmail } = require('./exceldata/sendEmail')
const excelschema = require('./models/excelschema')

app.use(express.json());
app.set('view engine','ejs');

DB.connectToMongo()

// Data ko email pr send pr send krne ke liye
app.post('/home',async(req,res)=>{
    const users = await excelschema.find({}, 'name email');
     for(const user of users){
    const { name, email } = user;
       const ejsFilePath="views/certificate.ejs";

    const fileRead=fs.readFileSync(ejsFilePath,"utf-8");

    const html=ejs.render(fileRead,{name:name});

    const browser=await puppeteer.launch({headless:"new"});

    const page=await browser.newPage();

    await page.setContent(html);

    const pdfBuffer=await page.pdf({format:"A4"});

    await browser.close();



    await sendEmail(name,email,`${name}.pdf`,pdfBuffer);
   }

    res.send({success: true, message: 'Email sent successfully!'});

})

app.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file

    const file = reader.readFile('./uploads/' + req.file.filename)

    // console.log(req.file)
    // res.send({ msg: "got it" })

    getData.getExcelData(file).then(() => {
        res.json({ message: 'File uploaded successfully!' });
    }).catch((err) => {
        res.json({ err: 'Failed!' });
    })
});


app.listen(4000, () => {
    console.log('server started at 4000')
})