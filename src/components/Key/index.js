import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { note as noteFn } from '@tonaljs/tonal';

/**
 * @param black indicates whether to color the key black
 * @param letter the keyboard key being mapped to
 * @param note the musical note being mapped
 * @param interval the musical interval from the tonic that the key represents
 * @param pressed whether the key is being played
 * @param onMouseDown play note handler
 * @param onMouseUp stop note handler
 */
const Key = ({
   black,
   letter,
   note,
   interval,
   pressed,
   onMouseDown,
   onMouseUp,
}) => (
   <Wrapper>
      <Button
         black={black}
         pressed={pressed}
         onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}
      >
         <Letter>{letter}</Letter>
         <Note>
            {noteFn(note).pc.replace(/#/g, '\u266F').replace(/b/g, '\u266D')}
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
   pressed: PropTypes.bool,
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

const buttonBackground = props => {
   if (props.black) {
      if (props.pressed) {
         return '#4f4f4f';
      }
      return '#000';
   }
   if (props.pressed) {
      return '#e3e3e3';
   }
   return '#fafafa';
};

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
   color: ${p => (p.black ? '#fafafa' : '#000')};
   background: ${buttonBackground};
   &:focus {
      outline-color: ${p => (p.black ? '#fafafa' : '#000')};
      outline-offset: -3px;
      outline-width: 2px;
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
