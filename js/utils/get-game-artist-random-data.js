import config from '../config';
import tracks from '../data/tracks';

const tracksListSize = config.maxTracksArtist;

export default () => {
  const tmpTracks = tracks.slice();
  const currentTracks = Array.from({length: tracksListSize}, () => {
    const index = Math.floor(Math.random() * tmpTracks.length);
    return tmpTracks.splice(index, 1)[0];
  });

  const correctAnswer = currentTracks[
      Math.floor(Math.random() * currentTracks.length)
  ];

  return {
    correctAnswer,
    tracks: currentTracks
  };
};
