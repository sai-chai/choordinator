import React, { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import keyGen from 'weak-key';
import Soundfont from 'soundfont-player';

import { note } from '@tonaljs/tonal';
import { rotate } from '@tonaljs/array';
import { scale as scaleInfo } from '@tonaljs/scale';

import Key from 'components/Key';
import {
   HOME_ROW_KEYS,
} from './constants';

// NOTE: this `scale` is different from containers/App
// It's in the format "tonic scale", e.g. "C4 Major", "Ab3 mixolydian"
const PianoRoll = ({ tonic, scale }) => {
   const audioContext = useMemo(() => new (window.AudioContext || window.webkitAudioContext)(), []); // workaround for Safari
   const currentScale = useMemo(() => scaleInfo(`${tonic} ${scale}`), [tonic, scale]);
   const [activeNodes, setActiveNodes] = useState({});
   const [isLoading, setLoading] = useState(true);
   const [loadingError, setLoadingError] = useState(false);
   const [instrument, setInstrument] = useState({});

   const instrumentLoader = useCallback(() => {
      async function load () {
         return await Soundfont.instrument(
            audioContext,
            'electric_piano_1',
            { soundfont: 'FluidR3_GM' }
         )
            .then(result => {
               setLoading(false);
               setInstrument(result);
            })
            .catch(err => {
               console.log(err);
               setLoadingError(true);
            });
      }
      load();
   }, []);

   useEffect(instrumentLoader, []);

   useEffect(() => () => audioContext.close(), [audioContext]);

   const playNote = useCallback(midiNote => () => {
      if (!activeNodes[midiNote]) {
         audioContext.resume().then(() => {
            const audioNode = instrument.play(midiNote);
            setActiveNodes({ ...activeNodes, [midiNote]: audioNode });
         });
      }
   }, [audioContext, instrument, activeNodes]);

   const stopNote = useCallback(midiNote => () => {
      audioContext.resume().then(() => {
         if (!activeNodes[midiNote]) return;
         const audioNode = activeNodes[midiNote];
         audioNode.stop();
         setActiveNodes({ ...activeNodes, [midiNote]: null });
      });
   }, [audioContext, instrument, activeNodes]);

   const keys = useMemo(() => {
      let currentNotes = rotate(-2, currentScale.notes);
      let currentIntervals = rotate(-2, currentScale.intervals);
      const result = [];
      HOME_ROW_KEYS.forEach((letter, index) => {
         let transpose = 0;
         if (index < 2) {
            transpose = -1;
         } else if (index >= currentNotes.length + 2) {
            transpose = 1;
         }
         const noteInfo = note(currentNotes[0]);
         const play = playNote(noteInfo.midi + (transpose * 12));
         const stop = stopNote(noteInfo.midi + (transpose * 12));
         let code;
         if (index < HOME_ROW_KEYS.length - 2) code = "Key" + letter;
         else code = letter === ";" ? "Semicolon" : "Quote";
         // See https://github.com/tonaljs/tonal/tree/master/packages/tonal
         // for documentation on Tonal's Note interface.
         result.push({
            letter,
            code,
            note: noteInfo.pc + (noteInfo.oct + transpose),
            interval: currentIntervals[0],
            black: noteInfo.alt !== 0,
            onMouseDown: play,
            onMouseUp: stop,
         });

         currentNotes = rotate(1, currentNotes);
         currentIntervals = rotate(1, currentIntervals);
      });
      return result;
   }, [currentScale, isLoading, playNote, stopNote]);

   const onKeyboardEvent = useCallback(e => {
      const key = keys.find(k => k.code === e.code);
      if (!key) return;
      if (e.type === "keydown") key.onMouseDown();
      if (e.type === "keyup") key.onMouseUp();
   }, [keys]);

   useEffect(() => {
      window.onkeyup = onKeyboardEvent;
      window.onkeydown = onKeyboardEvent;
   }, [onKeyboardEvent]);

   if (loadingError) {
      return <Container isLoading><div>Error</div></Container>;
   }
   return (
      <Container isLoading={isLoading} >
         {!isLoading && keys.map(key =>
            <Key key={keyGen(key)} {...key} />
         )}
      </Container>
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
   ${p => p.isLoading && css`
      min-width: 320px;
      width: 100%;
      height: 299px;
      background: linear-gradient(90deg, #f3dec1 40%, #eec994 50%, #f3dec1 60%);
      background-size: 400% 100%;
      animation: 0.7s ${loadingA7n} linear infinite;
   `};
`;

export default PianoRoll;
