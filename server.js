const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
 });

app.get('/sandsim', (req, res) => {
    res.sendFile(__dirname + '/public/sandsim.html');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

