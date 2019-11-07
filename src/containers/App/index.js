
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
   background-color: #F3DEC1;
   min-height: 100vh;
   * {
      font-family: 'Helvetica', Arial, sans-serif;
      font-size: 1.6rem;
   }
`;

const Header = styled.header.attrs({
   role: 'navigation'
})`
   color: #fff;
   background-color: #77474B;
   height: 50px;
   padding-left: 50px;
   display: flex;
   flex-direction: row;
`;

const Title = styled.h1`
   font-size: 2.0rem;
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

const Key = styled.button`
   background: ${p => p.black ? '#000' : '#fafafa'};
   height: 100px;
   width: 50px;
   border: 0;
   margin-right: 10px;
   padding: 5px;
   &:last-child {
      margin-right: 0;
   }
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
               <Key black />
               <Key />
               <Key />
               <Key black />
               <Key />
               <Key black />
               <Key />
               <Key black />
               <Key />
               <Key />
               <Key black />
            </PianoRoll>
         </Main>
      </Wrapper>
   );
}

export default App;
