const express = require('express');
const app = express();

// Parse JSON data
app.use(express.json());

// Temporary storage
let playlist = [];

// Route to add a song to the playlist
app.post('/songs', (req, res) => {
	const { title, artists, url } = req.body;
	if (!title || !artists || !url) {
		return res
			.status(400)
			.json({ message: 'Please add title, artists, and URL.' });
	}

	const newSong = { title, artists, url, playCount: 0 };
	playlist.push(newSong);

	return res
		.status(201)
		.json({ message: 'Song added to playlist successfully.' });
});

// Route to play a song from the playlist
app.get('/play/:songIndex', (req, res) => {
	const songIndex = parseInt(req.params.songIndex);
	if (songIndex >= 0 && songIndex < playlist.length) {
		const songToPlay = playlist[songIndex];
		songToPlay.playCount += 1;
		return res.json({ message: 'Playing song', song: songToPlay });
	} else {
		return res.status(404).json({ message: 'Song not found.' });
	}
});

// Route to get the list of songs in the playlist
app.get('/playlist', (req, res) => {
    if (playlist.length <= 0) {
        return res.json({message: 'Song not added yet.'});
    } else {
        return res.json(playlist);
    }
});

// songs most played
app.get('/playlist/popular', (req, res) => {
    if (playlist.length <= 0) {
        return res.json({message: 'Song not added yet.'});
    } else {
        const sortedSongs = playlist.sort((a, b) => b.playCount - a.playCount);
        return res.json(sortedSongs);
    }
});

// For not defined route
app.all('*', (req, res) => {
	res.status(400).json({message: 'resource not found.'});
});

// Start the server
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
