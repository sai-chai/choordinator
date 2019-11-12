import React from 'react';
import styled from 'styled-components';
import keyGen from 'weak-key';
import { note } from '@tonaljs/tonal';
import { rotate } from '@tonaljs/array';
// import Range from '@tonaljs/range';
import { scale } from '@tonaljs/scale';
import { entries as scaleDictionary } from '@tonaljs/scale-dictionary';
import Key from 'components/Key';
import {
   HOME_ROW_KEYS,
   /* RANGE_TUPLET */
} from './constants';

const Wrapper = styled.div`
   background-color: #F3DEC1;
   min-height: 100vh;
   font-family: 'Helvetica', Arial, sans-serif;
`;

const Header = styled.header.attrs({
   role: 'navigation',
})`
   color: #fff;
   background-color: #77474B;
   height: 50px;
   padding-left: 50px;
   display: flex;
   flex-direction: row;
`;

const Title = styled.h1`
   font-size: 2.4rem;
   line-height: 50px;
   font-style: italic;
   font-weight: 500;
`;

const Main = styled.main`
   max-width: 1000px;
   margin: 0 auto;
`;

const Settings = styled.form`
   display: flex;
   flex-direction: row;
   justify-content: center;
`;

const PianoRoll = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
`;

const Select = styled(p => (
   <select name={p.name} defaultValue="major">
      {p.options.map(option => (
         <option
            key={keyGen({ name: option })} // weak-key only hashes objects
            value={option}
         >
            {option}
         </option>
      ))}
   </select>
))``;

// For scale dropdown, e.g. major, minor, mixolydian, etc.
const scaleNames = scaleDictionary().reduce((acc, curr) => {
   acc.push(curr.name);
   return acc;
}, []);


// For tonic selector, e.g. C5, Ab4, G1, etc.
// const noteRange = Range.chromatic(RANGE_TUPLET);

// Props for key mapping
const keys = [];

// Mock for development
const currentScale = scale('C4 minor');
let currentNotes = rotate(-2, currentScale.notes);
let currentIntervals = rotate(-2, currentScale.intervals);

HOME_ROW_KEYS.forEach((key, index) => {
   let transpose = 0;
   if (index < 2) {
      transpose = -1;
   } else if (index >= currentNotes.length + 2) {
      transpose = 1;
   }
   keys.push({
      letter: key,
      note: note(currentNotes[0]).pc + (note(currentNotes[0]).oct + transpose),
      interval: currentIntervals[0],
      black: note(currentNotes[0]).alt !== 0,
   });
   currentNotes = rotate(1, currentNotes);
   currentIntervals = rotate(1, currentIntervals);
});

function App (props) {
   // const [infoOpen, setInfoOpen] = useState(false);
   // const onInfoClick = e => {
   //    setInfoOpen(!infoOpen);
   //    e.stopPropagation();
   // };
   return (
      <Wrapper>
         <Header>
            <Title>
               The Choordinator
            </Title>
            {/* <InfoButton onClick={onInfoClick} /> */}
         </Header>
         <Main>
            <Settings>
               <Select name="scale" options={scaleNames} />
            </Settings>
            <PianoRoll>
               {keys.map(key =>
                  <Key key={keyGen(key)} {...key} />
               )}
            </PianoRoll>
         </Main>
      </Wrapper>
   );
}

export default App;
