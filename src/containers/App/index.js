import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

// import { note } from '@tonaljs/tonal';
// import { rotate } from '@tonaljs/array';
import { entries as scaleDictionary } from '@tonaljs/scale-dictionary';
import { chromatic } from '@tonaljs/range';

import PianoRoll from 'containers/PianoRoll';
import Select from 'components/Select';

import { RANGE_TUPLET, DEFAULT_TONIC } from './constants';


function App (props) {
   // const [infoOpen, setInfoOpen] = useState(false);
   // const onInfoClick = e => {
   //    setInfoOpen(!infoOpen);
   //    e.stopPropagation();
   // };
   const [scale, setScale] = useState("major");
   const [tonic, setTonic] = useState(DEFAULT_TONIC);

   // For scale dropdown, e.g. major, minor, mixolydian, etc.
   const scaleNames = useMemo(
      () => scaleDictionary().reduce(
         (acc, curr) => {
            acc.push(curr.name);
            return acc;
         }, []
      )
   );

   // For tonic selector, e.g. C5, Ab4, G1, etc.
   const tonicList = useMemo(() => chromatic(RANGE_TUPLET));

   return (
      <Container>
         <Header>
            <Title>
               The Choordinator
            </Title>
            {/* <InfoButton onClick={onInfoClick} /> */}
         </Header>
         <Main>
            <Settings>
               <Select
                  name="tonic"
                  value={tonic}
                  options={tonicList}
                  setState={setTonic}
               />
               <Select
                  name="scale"
                  value={scale}
                  options={scaleNames}
                  setState={setScale}
               />
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

export default App;
