import config from '../config';
import trackList from '../data/tracks';

/**
 * Линейный конгруэнтный генератор
 * Нужен, чтобы создавать псевдорандомную посл-ть данных,
 * которая не будет меняться с течением времени
 * @param {number} seed — начальное значение
 * @param {number} m — модуль
 * @param {number} a — множитель
*/
const linMultGen = function* (seed, m, a) {
  let val = seed;
  for (;;) {
    val = (a * val) % m;
    yield val;
  }
};

const uniDistrGen = function* (seed = 1, m = Math.pow(2, 31) - 1, a = 48271) {
  const lmg = linMultGen(seed, m, a);
  for (;;) {
    const val = lmg.next().value;
    yield val / m;
  }
};

const udg = uniDistrGen(1312412);

const getRandomAtristData = (tracks, tracksListSize = config.maxTracksArtist) => {
  const tmpTracks = tracks.slice();
  const tmpTracksLength = tmpTracks.length;
  const currentTracks = [];

  const uniqueArtistsLength = tracks.filter((el1, index) => {
    return tracks.findIndex((el2) => el2.artist === el1.artist) === index;
  }).length;

  const pushedTracksArtists = [];
  while (currentTracks.length !== tracksListSize) {
    const index = Math.floor(udg.next().value * tmpTracksLength);
    const track = tmpTracks[index];

    if (pushedTracksArtists.length === uniqueArtistsLength) {
      currentTracks.push(track);
      continue;
    }
    if (pushedTracksArtists.indexOf(track.artist) !== -1) {
      continue;
    } else {
      pushedTracksArtists.push(track.artist);
      currentTracks.push(track);
    }
  }

  const correctTrack = currentTracks[
      Math.floor(udg.next().value * currentTracks.length)
  ];
  // console.log(correctTrack.artist)

  return {
    correctTrack,
    tracks: currentTracks
  };
};

const getRandomGenreData = (tracks, tracksListSize = config.maxTracksGenre) => {
  const tmpTracks = tracks.slice();
  const currentTracks = Array.from({length: tracksListSize}, () => {
    const index = Math.floor(udg.next().value * tmpTracks.length);
    return tmpTracks.splice(index, 1)[0];
  });

  const genre = currentTracks[
      Math.floor(udg.next().value * currentTracks.length)
  ].genre;

  const correctAnswerIndexes = [];

  currentTracks.forEach((el, i) => {
    if (currentTracks[i].genre === genre) {
      correctAnswerIndexes.push(i);
    }
  });
  // console.log(correctAnswerIndexes)

  return {
    tracks: currentTracks,
    correctAnswer: {
      genre,
      indexes: correctAnswerIndexes
    }
  };
};

export default (totalGamesCount = config.maxGameRounds,
    artistGamesCount = totalGamesCount / 2,
    genreGamesCount = totalGamesCount / 2) => {
  const questions = [];

  for (let i = 0; i < artistGamesCount; i++) {
    questions.push(Object.assign(getRandomAtristData(trackList), {
      type: `artist`
    }));
  }
  for (let i = 0; i < genreGamesCount; i++) {
    questions.push(Object.assign(getRandomGenreData(trackList), {
      type: `genre`
    }));
  }

  return questions;
};
