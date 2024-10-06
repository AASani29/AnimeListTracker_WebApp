const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users/users.txt');
const errorHtmlPath = path.join(__dirname, '../html_files/error.html');
const animesFilePath = path.join(__dirname, '../users/animes.txt');



const emailValidation = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu)$/;
    return emailRegex.test(email);
};


function emailExists(email) {
    const users = fs.readFileSync(usersFilePath, 'utf8').split('\n');
    return users.some(user => user.split(',')[1] === email);
}


const sendErrorWithRefresh = (res, message) => {
    fs.readFile(errorHtmlPath, 'utf8', (err, data) => {
        if (err) {
            return res.send('Error: Unable to load error page.');
        }
        const updatedHtml = data.replace('<p id="errorMessage"></p>', `<p>${message}</p>`);
        res.send(updatedHtml);
    });
};


const signup = (req, res) => {
    const { name, email, password, anime1, anime2 } = req.body;

    if (!emailValidation(email)) {
        const errorMessage = 'Error: Invalid email format. Please use a valid email.';
        if (req.headers['content-type'] === 'application/json') {
            return res.status(400).json({ message: errorMessage });
        } else {
            return sendErrorWithRefresh(res, errorMessage);
        }
    }


    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!password.match(passwordRegex)) {
        const errorMessage = 'Error: Password must be at least 8 characters long, with one capital letter and one number.';
        if (req.headers['content-type'] === 'application/json') {
            return res.status(400).json({ message: errorMessage });
        } else {
            return sendErrorWithRefresh(res, errorMessage);
        }
    }

    if (emailExists(email)) {
        const errorMessage = 'Error: Email already exists. Please use a different email.';
        if (req.headers['content-type'] === 'application/json') {
            return res.status(409).json({ message: errorMessage });
        } else {
            return sendErrorWithRefresh(res, errorMessage);
        }
    }

  
    const userData = `${name},${email},${password}\n`;
    fs.appendFileSync(usersFilePath, userData);

    const animeData = `${email},${anime1},${anime2}\n`;
    fs.appendFileSync(animesFilePath, animeData);

    if (req.headers['content-type'] === 'application/json') {
        return res.status(201).json({ message: 'Signup successful. You can now log in.' });
    } else {
        res.redirect('/login.html');
    }
};


const login = (req, res) => {
    const { email, password } = req.body;
    const users = fs.readFileSync(usersFilePath, 'utf8').split('\n');
    const user = users.find(user => user.split(',')[1] === email && user.split(',')[2] === password);

    if (user) {
        req.session.email = email; 
        if (req.headers['content-type'] === 'application/json') {
          
            return res.status(200).json({ message: 'Login successful' });
        }
        return res.redirect('/home');
    } else {
        if (req.headers['content-type'] === 'application/json') {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

    req.session.email = email;
    res.redirect('/home');
    }
};

module.exports = { signup, login };
