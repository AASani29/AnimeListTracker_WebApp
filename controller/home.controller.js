const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users/users.txt');
const animesFilePath = path.join(__dirname, '../users/animes.txt');

const getUserAnimes = (req, res) => {
    const { email } = req.session;

    if (!email) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const animesFileContent = fs.readFileSync(animesFilePath, 'utf8');
    console.log('Anime file content:', animesFileContent);

    const animeList = fs.readFileSync(animesFilePath, 'utf8')
        .split('\n')
        .find(line => line.split(',')[0] === email)?.split(',').slice(1) || []; 

    console.log('Retrieved anime list:', animeList);

    const formattedAnimes = animeList.map(anime => {
        return anime; 
    });

    res.json({ email, animes: formattedAnimes });
};

const getHomePage = (req, res) => {
    const { email } = req.session;

    if (!email) {
        return res.redirect('/');
    }

    const users = fs.readFileSync(usersFilePath, 'utf8').split('\n');
    const user = users.find(user => user.split(',')[1] === email);

    if (!user) {
        return res.redirect('/');
    }

   
    res.sendFile(path.join(__dirname, '../html_files/home.html'));
};


const addAnime = (req, res) => {
    console.log(req.body);
    const { email } = req.session; 
    const { anime } = req.body;

    if (!anime) {
        return res.status(400).send('Anime name and description are required');
    }

    const animes = fs.readFileSync(animesFilePath, 'utf8').split('\n');
    const userAnimeIndex = animes.findIndex(line => line.split(',')[0] === email);

    if (userAnimeIndex === -1) {
        return res.status(404).send('User not found');
    }

    const userAnimeData = animes[userAnimeIndex].split(',');

    const description = userAnimeData[index].split('|')[1]; 

    userAnimeData.push(`${anime}|${description}`); 
    animes[userAnimeIndex] = userAnimeData.join(','); 
    fs.writeFileSync(animesFilePath, animes.join('\n')); 
    res.status(200).send('Anime added successfully');
};


const editAnime = (req, res) => {
    console.log(req.body);
    const { email } = req.session; 
    const { oldTitle, newTitle } = req.body;

    if (!oldTitle || !newTitle ) {
        return res.status(400).send('Old title, new title, and new description are required');
    }

   
    const animes = fs.readFileSync(animesFilePath, 'utf8').split('\n');
    const userAnimeIndex = animes.findIndex(line => line.split(',')[0] === email);

    if (userAnimeIndex === -1) {
        return res.status(404).send('User not found');
    }

    const userAnimeData = animes[userAnimeIndex].split(',').slice(1); 

    const index = userAnimeData.findIndex(anime => anime.split('|')[0].trim() === oldTitle.trim()); 
    
    
    if (index !== -1) {
        const currentDescription = userAnimeData[index].split('|')[1]; 
        userAnimeData[index] = `${newTitle}|${currentDescription}`; 
        animes[userAnimeIndex] = `${email},${userAnimeData.join(',')}`; 
        fs.writeFileSync(animesFilePath, animes.join('\n')); 
        res.status(200).send('Anime updated successfully');
    } else {
        res.status(404).send('Anime not found');
    }

};


const deleteAnime = (req, res) => {
    console.log(req.body);
    const { email } = req.session; 
    const { title } = req.body;

    if (!title) {
        return res.status(400).send('Anime title is required');
    }

    const animes = fs.readFileSync(animesFilePath, 'utf8').split('\n');
    const userAnimeIndex = animes.findIndex(line => line.split(',')[0] === email);

    if (userAnimeIndex === -1) {
        return res.status(404).send('User not found');
    }

    const userAnimeData = animes[userAnimeIndex].split(',').slice(1); 
    const filteredAnimes = userAnimeData.filter(anime => anime.split('|')[0].trim() !== title.trim()); 

    if (filteredAnimes.length < userAnimeData.length) {
        animes[userAnimeIndex] = `${email},${filteredAnimes.join(',')}`; 
        fs.writeFileSync(animesFilePath, animes.join('\n')); 
        res.status(200).send('Anime deleted successfully');
    } else {
        res.status(404).send('Anime not found');
    }
};


const addDescription = (req, res) => {
    console.log(req.body);
    const { email } = req.session; 
    const { title, description } = req.body; 

    if (!title || !description) {
        return res.status(400).send('Anime title and description are required');
    }


    const animes = fs.readFileSync(animesFilePath, 'utf8').split('\n');
    const userAnimeIndex = animes.findIndex(line => line.split(',')[0] === email);

    if (userAnimeIndex === -1) {
        return res.status(404).send('User not found');
    }

    const userAnimeData = animes[userAnimeIndex].split(',').slice(1); 
    const index = userAnimeData.findIndex(anime => anime.split('|')[0].trim() === title.trim());


    if (index !== -1) {
 
        const animeTitle = userAnimeData[index].split('|')[0]; 
        userAnimeData[index] = `${animeTitle}|${description}`; 
        animes[userAnimeIndex] = `${email},${userAnimeData.join(',')}`;
        fs.writeFileSync(animesFilePath, animes.join('\n')); 
        res.status(200).send('Anime description updated successfully');
    } else {
        res.status(404).send('Anime not found');
    }
};


module.exports = { getHomePage, addAnime, editAnime, deleteAnime, getUserAnimes, addDescription };
