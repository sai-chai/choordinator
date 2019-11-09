import React from 'react';
import styled from 'styled-components';
import Key from 'components/Key';

const Wrapper = styled.div`
   background-color: #F3DEC1;
   min-height: 100vh;
   * {
      font-family: 'Helvetica', Arial, sans-serif;
   }
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

const PianoRoll = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
`;

// const [infoOpen, setInfoOpen] = useState(false);

function App (props) {
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
            <PianoRoll>
               <Key black letter="A" note={"C\u266F"} interval="m5" />
            </PianoRoll>
         </Main>
      </Wrapper>
   );
}

export default App;
