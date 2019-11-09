import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
   font-family: 'Courier New', Courier, monospace;
   margin-left: 5px;
   margin-right: 5px;
   &:first-child {
      margin-left: 0;
   }
   &:last-child {
      margin-right: 0;
   }
`;

const Button = styled.button`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 150px;
   width: 50px;
   border: 0;
   padding: 5px;
   font-size: 1.6rem;
   ${p => p.black ?
      'background: #000; color: #fafafa' :
      'background: #fafafa; color: #000'};
   &:focus {
      outline: none;
   }
`;

const Letter = styled.div`
   color: inherit;
`;

const Note = styled.div`
   color: inherit;
`;

const Interval = styled.div`
   font-size: 1.6rem;
   text-align: center;
   margin: 10px 0;
`;

const Key = ({ black, letter, note, interval, onClick }) => (
   <Wrapper>
      <Button black={black} onClick={onClick}>
         <Letter>
            {letter}
         </Letter>
         <Note>
            {note}
         </Note>
      </Button>
      <Interval>
         {interval}
      </Interval>
   </Wrapper>
);

Key.propTypes = {
   black: PropTypes.bool,
   letter: PropTypes.string,
   note: PropTypes.string,
   interval: PropTypes.string,
   onClick: PropTypes.func,
};

export default Key;
