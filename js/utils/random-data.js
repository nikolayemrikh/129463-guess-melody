import config from '../config';
import getTrackList from '../data/tracks.js';
import {GameType} from '../enums';

/**
 * Генератор равномерно распределенной СВ на интервале [0, 1]
 * Нужен, чтобы создавать псевдорандомную посл-ть данных,
 * которая не будет меняться с течением времени
 * @param {number} seed — начальное значение
 * @param {number} m — модуль
 * @param {number} a — множитель
*/
const uniDistrGen = function* (seed = 1, m = Math.pow(2, 31) - 1, a = 48271) {
  let val = seed;
  for (;;) {
    val = (a * val) % m;
    yield val / m;
  }
};

const udg = uniDistrGen(10);

const markRandomCorrect = (tracks, type) => {
  const typeValue = tracks[
      Math.floor(udg.next().value * tracks.length)
  ][type];

  tracks.forEach((el, i) => {
    tracks[i].isCorrect = el[type] === typeValue;
  });
  return tracks;
};

const getGenericData = (type, tracks, tracksListSize) => {
  const tmpTracks = tracks.slice();
  // let tmpTracksLength = tmpTracks.length;
  let currentTracks = [];

  const uniqueArtists = new Set(); // уникальные артисты
  const uniqueArtistsTracks = new Map(); // соответствующие им треки

  for (let track of tmpTracks) {
    uniqueArtists.add(track[type]);
  }

  for (let artist of uniqueArtists) {
    uniqueArtistsTracks.set(artist, []);
  }

  for (let track of tmpTracks) {
    const arr = uniqueArtistsTracks.get(track[type]);
    arr.push(track);
  }

  if (uniqueArtists.size < tracksListSize) {
    // Если уникальных артистов меньше, чем нужно выдать треков
    // Возьмем всех уникальных и остальных рандомных
    for (let artist of uniqueArtists) {
      const artistTracks = uniqueArtistsTracks.get(artist);
      const n = artistTracks.length;
      const i = Math.floor(udg.next().value * n);
      currentTracks.push(artistTracks[i]);
    }
    const uniqueArtistsArr = Array.from(uniqueArtists);
    const uniqueArtistsLength = uniqueArtistsArr.length;
    while (currentTracks.length < tracksListSize) {
      const i = Math.floor(udg.next().value * uniqueArtistsLength);
      const artistTracks = uniqueArtistsTracks.get(uniqueArtistsArr[i]);
      const trackIndex = Math.floor(udg.next().value * artistTracks.length);
      currentTracks.push(artistTracks[trackIndex]);
    }
  } else if (uniqueArtists.size === tracksListSize) {
    // Если уникальных артистов столько же, сколько нужно выдать треков
    // Возьмем с каждого артиста по рандомному треку
    for (let artist of uniqueArtists) {
      const artistTracks = uniqueArtistsTracks.get(artist);
      const n = artistTracks.length;
      const i = Math.floor(udg.next().value * n);
      currentTracks.push(artistTracks[i]);
    }
  } else {
    // Если уникальных артистов больше, чем нужно выдать треков
    // Возьмем рандомных артистов, а у них по рандомному треку
    const uniqueArtistsArr = Array.from(uniqueArtists);
    const uniqueArtistsLength = uniqueArtistsArr.length;
    const indexes = new Set();
    while (indexes.size < tracksListSize) {
      indexes.add(Math.floor(udg.next().value * uniqueArtistsLength));
    }
    for (let i of indexes) {
      const artistTracks = uniqueArtistsTracks.get(uniqueArtistsArr[i]);
      const trackIndex = Math.floor(udg.next().value * artistTracks.length);
      currentTracks.push(artistTracks[trackIndex]);
    }
  }
  currentTracks = markRandomCorrect(currentTracks, type);
  return currentTracks;
};

export default (totalGamesCount = config.maxGameRounds,
    artistGamesCount = totalGamesCount / 2,
    genreGamesCount = totalGamesCount / 2) => {
  const questions = [];

  for (let i = 0; i < artistGamesCount; i++) {
    questions.push({
      tracks: getGenericData(GameType.ARTIST, getTrackList(), config.maxTracksArtist),
      type: GameType.ARTIST
    });
  }
  for (let i = 0; i < genreGamesCount; i++) {
    questions.push({
      tracks: getGenericData(GameType.GENRE, getTrackList(), config.maxTracksGenre),
      type: GameType.GENRE
    });
  }
  return questions;
};
