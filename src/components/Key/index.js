import React from 'react';
import PropTypes from 'prop-types';
import { note as noteFn } from '@tonaljs/tonal';
import styled from 'styled-components';

const Wrapper = styled.div`
   margin-left: 2.5px;
   margin-right: 2.5px;
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
   font-family: 'Courier New', Courier, monospace;
   font-size: 1.6rem;
   height: 150px;
   width: 50px;
   border: 0;
   padding: 5px;
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
            {noteFn(note).pc.replace('#', '\u266F').replace('b', '\u266D')}
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
