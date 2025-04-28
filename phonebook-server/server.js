const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Мока данни за контакти в паметта
let contacts = [
    { name: "John Doe", phone: ["1234567890"], address: "123 Main St", image: "", metaInfo: "Sample contact" },
    { name: "Jane Doe", phone: ["9876543210"], address: "456 Another St", image: "", metaInfo: "Another contact" },
];

// Настройка на multer за качване на снимки
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');  // Папка за снимки
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Име на файла
    }
});
const upload = multer({ storage: storage });

// Middleware за работа с JSON
app.use(express.json());

// Редактиране на контакт
const { body, validationResult } = require('express-validator');

app.put('/contacts/:name',
  body('phone').isArray().withMessage('Phone must be an array'),
  body('address').isString().withMessage('Address must be a string'),
  body('image').optional().isString().withMessage('Image path must be a string'),
  body('metaInfo').optional().isString().withMessage('Meta information must be a string'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Вашият код за актуализиране на контактите тук...
  }
);

// Сливане на контакти
app.post('/contacts/merge', (req, res) => {
    const { contactNames } = req.body;
    let mergedContact = { name: contactNames[0], phone: [], address: '', image: '', metaInfo: '' };

    contactNames.forEach(name => {
        const contact = contacts.find(c => c.name === name);
        if (contact) {
            mergedContact.phone.push(contact.phone);
            mergedContact.address = contact.address || mergedContact.address;
            mergedContact.image = contact.image || mergedContact.image;
            mergedContact.metaInfo = contact.metaInfo || mergedContact.metaInfo;
        }
    });

    // Премахваме старите контакти и добавяме новия обединен контакт
    contacts = contacts.filter(contact => !contactNames.includes(contact.name));
    contacts.push(mergedContact);

    res.status(200).json(mergedContact);  // Връщаме обединените данни
});

// Качване на снимка
app.post('/contacts/:name/upload', upload.single('image'), (req, res) => {
    const { name } = req.params;
    const image = req.file.path;

    let updatedContact = contacts.find(contact => contact.name === name);
    if (updatedContact) {
        updatedContact.image = image;  // Записваме пътя на снимката
        res.status(200).json(updatedContact);  // Връщаме актуализираните данни за контакта
    } else {
        res.status(404).send('Contact not found');
    }
});

// Връща всички контакти
app.get('/contacts', (req, res) => {
    res.json(contacts);
});

// Стартиране на сървъра
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});