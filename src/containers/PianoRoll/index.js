import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import keyGen from 'weak-key';
import Soundfont from 'soundfont-player';
import useCancellablePromise from 'utils/cancellable-promise';

import Note from '@tonaljs/note';
import Collection from '@tonaljs/collection';
import Scale from '@tonaljs/scale';
import Chord from '@tonaljs/chord';

import Key from 'components/Key';
import { HOME_ROW_KEYS } from './constants';

/**
 * Holds the audio and music theory scripting of the app
 * Displays a piano roll to indicate to the user the mapping
 * of piano keys to keyboard keys. Also detects and displays chords.
 *
 * @param {string} tonic the tonic to set the scale at
 * @param {string} scale the mode or scale to display
 */
const PianoRoll = ({ tonic, scale }) => {
   const registerPromise = useCancellablePromise();
   // webkitAudioContext is a workaround for older Safari versions
   const audioContext = React.useMemo(
      () => new (window.AudioContext || window.webkitAudioContext)(),
      [],
   );

   const currentScale = React.useMemo(
      () => Scale.get([tonic, scale].join(' ')),
      [tonic, scale],
   );
   const [activeNodes, setActiveNodes] = React.useState({});
   const [playingNotes, setPlayingNotes] = React.useState([]);
   const [isLoading, setLoading] = React.useState(true);
   const [loadingError, setLoadingError] = React.useState(false);
   const [instrument, setInstrument] = React.useState({});

   React.useEffect(() => {
      // audioContext is used to ensure that async fxn doesn't
      // cause a memory leak if it resolves after a dismount
      (async function () {
         try {
            const result = await registerPromise(
               Soundfont.instrument(audioContext, 'electric_piano_1', {
                  soundfont: 'FluidR3_GM',
               }),
            );
            setLoading(false);
            setInstrument(result);
         } catch (error) {
            if (!error.isCanceled) {
               console.log(error);
               setLoadingError(true);
            }
         }
      })();
   }, [audioContext, registerPromise]);

   // Mixin for 'play' event handler
   const playNote = React.useCallback(
      function (midiNote, noteName) {
         return function () {
            if (!activeNodes[midiNote]) {
               (async function () {
                  await audioContext.resume();
                  setActiveNodes({
                     ...activeNodes,
                     [midiNote]: instrument.play(midiNote),
                  });
               })();
               setPlayingNotes(playingNotes.concat(noteName));
            }
         };
      },
      [audioContext, instrument, activeNodes, playingNotes],
   );

   // Mixin for 'stop' event handler
   const stopNote = React.useCallback(
      function (midiNote, noteName) {
         return function () {
            if (!activeNodes[midiNote]) return;
            (async function () {
               await audioContext.resume();
               activeNodes[midiNote].stop();
               setActiveNodes({
                  ...activeNodes,
                  [midiNote]: null,
               });
            })();
            setPlayingNotes(playingNotes.filter(note => note !== noteName));
         };
      },
      [audioContext, activeNodes, playingNotes],
   );

   const keys = React.useMemo(
      function () {
         if (currentScale.empty) return [];
         let currentNotes = Collection.rotate(-2, currentScale.notes);
         let currentIntervals = Collection.rotate(-2, currentScale.intervals);
         const result = [];
         HOME_ROW_KEYS.forEach((letter, index) => {
            let transpose = 0;
            if (index < 2) {
               transpose = -1;
            } else if (index >= currentNotes.length + 2) {
               transpose = 1;
            }
            const noteInfo = Note.get(currentNotes[0]);
            const midiNote = noteInfo.midi + transpose * 12;

            let code;
            if (index < HOME_ROW_KEYS.length - 2) code = 'Key' + letter;
            else code = letter === ';' ? 'Semicolon' : 'Quote';
            const noteName =
               Note.simplify(noteInfo.pc) + (noteInfo.oct + transpose);
            // See https://github.com/tonaljs/tonal/tree/master/packages/tonal
            // for documentation on Tonal's Note interface.
            result.push({
               letter,
               code,
               note: noteName,
               interval: currentIntervals[0],
               black: noteInfo.alt !== 0,
               onMouseDown: playNote(midiNote, noteName),
               onMouseUp: stopNote(midiNote, noteName),
            });

            currentNotes = Collection.rotate(1, currentNotes);
            currentIntervals = Collection.rotate(1, currentIntervals);
         });
         return result;
      },
      [currentScale, playNote, stopNote],
   );

   const currentChord = React.useMemo(
      () => Chord.detect(Note.sortedNames(playingNotes)),
      [playingNotes],
   );

   const onKeyboardEvent = React.useCallback(
      function (e) {
         const key = keys.find(k => k.code === e.code);
         if (!key) return;
         if (e.type === 'keydown') key.onMouseDown();
         if (e.type === 'keyup') key.onMouseUp();
      },
      [keys],
   );

   React.useEffect(() => {
      window.addEventListener('keyup', onKeyboardEvent);
      window.addEventListener('keydown', onKeyboardEvent);
      return () => {
         window.removeEventListener('keyup', onKeyboardEvent);
         window.removeEventListener('keydown', onKeyboardEvent);
      };
   }, [onKeyboardEvent]);

   return loadingError ? (
      <Container isLoading>
         <div>Error</div>
      </Container>
   ) : (
      <>
         <Container isLoading={isLoading}>
            {!isLoading &&
               keys.map(key => (
                  <Key
                     key={keyGen(key)}
                     {...key}
                     pressed={playingNotes.includes(key.note)}
                  />
               ))}
         </Container>
         <div className="chord-name">{currentChord.join(', ')}</div>
      </>
   );
};

PianoRoll.propTypes = {
   tonic: PropTypes.string,
   scale: PropTypes.string,
};

const loadingA7n = keyframes`
	from {
		background-position: 0% 50%;
	}
	to {
		background-position: 100% 50%;
	}
`;

const Container = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
   ${p =>
      p.isLoading &&
      css`
         min-width: 320px;
         width: 100%;
         height: 299px;
         background: linear-gradient(
            90deg,
            #f3dec1 40%,
            #eec994 50%,
            #f3dec1 60%
         );
         background-size: 400% 100%;
         animation: 0.7s ${loadingA7n} linear infinite;
      `};
`;

export default PianoRoll;
