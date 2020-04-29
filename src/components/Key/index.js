import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { note as noteFn } from '@tonaljs/tonal';

const Key = ({ black, letter, note, interval, onMouseDown, onMouseUp }) => (
   <Wrapper>
      <Button black={black} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
         <Letter>{letter}</Letter>
         <Note>
            {noteFn(note).pc.replace('#', '\u266F').replace('b', '\u266D')}
         </Note>
      </Button>
      <Interval>{interval}</Interval>
   </Wrapper>
);

Key.propTypes = {
   black: PropTypes.bool,
   letter: PropTypes.string,
   code: PropTypes.string,
   note: PropTypes.string.isRequired,
   interval: PropTypes.string,
   onMouseDown: PropTypes.func.isRequired,
   onMouseUp: PropTypes.func.isRequired,
};

const Wrapper = styled.div`
   min-width: 25px;
   width: calc(8.33% - 5px);
   margin: 0 2.5px 10px;
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
   font-size: 2rem;
   height: 225px;
   width: 100%;
   border: 0;
   border-radius: 3px;
   padding: 10px;
   ${p =>
      p.black
         ? 'background: #000; color: #fafafa'
         : 'background: #fafafa; color: #000'};
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

export default Key;
