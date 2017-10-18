import config from '../config';
import tracks from '../data/tracks';

const tracksListSize = config.maxTracksArtist;

export default () => {
  const tmpTracks = tracks.slice();
  const currentTracks = Array.from({length: tracksListSize}, () => {
    const index = Math.floor(Math.random() * tmpTracks.length);
    return tmpTracks.splice(index, 1)[0];
  });

  const correctArtist = currentTracks[
      Math.floor(Math.random() * currentTracks.length)
  ].artist;

  return {
    correctAnswer: correctArtist,
    tracks: currentTracks
  };
};
