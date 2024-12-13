const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// تخزين البريد المؤقت والرسائل
let tempEmails = {};

// توليد بريد إلكتروني مؤقت
app.get("/generate-email", (req, res) => {
  const email = `user${Math.floor(Math.random() * 100000)}@tempdomain.com`;
  tempEmails[email] = [];
  
  // حذف البريد بعد 10 دقائق
  setTimeout(() => delete tempEmails[email], 600000); 
  
  res.json({ email });
});

// استقبال الرسائل
app.post("/receive-email", (req, res) => {
  const { email, from, subject, body } = req.body;
  if (tempEmails[email]) {
    tempEmails[email].push({ from, subject, body });
    res.status(200).send("Message received");
  } else {
    res.status(404).send("Email not found");
  }
});

// جلب الرسائل
app.get("/get-messages", (req, res) => {
  const email = req.query.email;
  res.json(tempEmails[email] || []);
});

// بدء الخادم
app.listen(3000, () => console.log("Server running on port 3000"));
