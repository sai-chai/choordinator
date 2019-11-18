import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import keyGen from 'weak-key';

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
   const currentScale = useMemo(() => scaleInfo(`${tonic} ${scale}`), [tonic, scale]);

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
         result.push({
            letter,
            note: note(currentNotes[0]).pc + (note(currentNotes[0]).oct + transpose),
            interval: currentIntervals[0],
            black: note(currentNotes[0]).alt !== 0,
         });
         currentNotes = rotate(1, currentNotes);
         currentIntervals = rotate(1, currentIntervals);
      });
      return result;
   }, [currentScale]);

   return (
      <Container>
         {keys.map(key =>
            <Key key={keyGen(key)} {...key} />
         )}
      </Container>
   );
};

PianoRoll.propTypes = {
   tonic: PropTypes.string,
   scale: PropTypes.string,
};

const Container = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
`;

export default PianoRoll;
