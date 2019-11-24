import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { entries as scaleDictionary } from '@tonaljs/scale-dictionary';
import { chromatic } from '@tonaljs/range';

import PianoRoll from 'containers/PianoRoll';
import Select from 'components/Select';
import ArrowSelect from 'components/ArrowSelect';

import { RANGE_TUPLET, DEFAULT_TONIC } from './constants';


function App (props) {
   const [scale, setScale] = useState("major");
   const [tonic, setTonic] = useState(DEFAULT_TONIC);

   // For scale dropdown, e.g. major, minor, mixolydian, etc.
   const scaleNames = useMemo(
      () => scaleDictionary().reduce(
         (acc, curr) => {
            acc.push(curr.name);
            return acc;
         }, []
      ).sort()
   );

   // For tonic selector, e.g. C5, Ab4, G1, etc.
   const tonicList = useMemo(() => chromatic(RANGE_TUPLET));

   return (
      <Container>
         <Header>
            <Title>
               The Choordinator
            </Title>
            <Subtitle>
               Playing the white keys never sounded so good...
            </Subtitle>
            {/* <InfoButton onClick={onInfoClick} /> */}
         </Header>
         <Main>
            <Settings>
               <div>
                  <Label>Tonic note:</Label>
                  <Label>Scale:</Label>
               </div>
               <div>
                  <ArrowSelect
                     name="tonic"
                     value={tonic}
                     options={tonicList}
                     setValue={setTonic}
                  />
                  <Select
                     name="scale"
                     value={scale}
                     options={scaleNames}
                     setValue={setScale}
                  />
               </div>
            </Settings>
            <PianoRoll tonic={tonic} scale={scale} />
         </Main>
      </Container>
   );
}

const Container = styled.div`
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
   padding: 0 50px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`;

const Title = styled.h1`
   font-size: 2.4rem;
   line-height: 5.0rem;
   font-style: italic;
   font-weight: 500;
`;

const Subtitle = styled.h3`
   font-size: 1.6rem;
   line-height: 5.0rem;
   font-family: 'Courier New', Courier, monospace;
   font-style: italic;
   font-weight: 700;
   @media (max-width: 770px) {
      display: none;
   }
`;

const Main = styled.main`
   max-width: 1000px;
   margin: 0 auto;
   padding: 0 0 36px;
`;

const Settings = styled.form`
   display: flex;
   flex-direction: row;
   padding: 2.4rem;
   justify-content: center;
   > div {
      display: flex;
      flex-direction: column;
      margin: 0 0.8rem;
      &:first-child {
         margin-left: 0;
      }
      &:last-child {
         margin-right: 0;
      }
   }
`;

const Label = styled.label`
   line-height: 3rem;
   font-size: 1.6rem;
   margin: 0.8rem 0;
   &:first-child {
      margin-top: 0;
   }
   &:last-child {
      margin-bottom: 0;
   }
`;

export default App;
