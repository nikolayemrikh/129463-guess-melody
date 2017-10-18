import config from '../config';
import tracks from '../data/tracks';

const tracksListSize = config.maxTracksGenre;

export default () => {
  const tmpTracks = tracks.slice();
  const currentTracks = Array.from({length: tracksListSize}, () => {
    const index = Math.floor(Math.random() * tmpTracks.length);
    return tmpTracks.splice(index, 1)[0];
  });

  const genre = currentTracks[
      Math.floor(Math.random() * currentTracks.length)
  ].genre;

  const rightAnswerIndexes = [];

  currentTracks.forEach((el, i) => {
    if (currentTracks[i].genre === genre) {
      rightAnswerIndexes.push(i);
    }
  });

  return {
    genre,
    tracks: currentTracks,
    rightAnswerIndexes
  };
};
