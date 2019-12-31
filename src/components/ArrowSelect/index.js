import React from 'react';
import PropTypes from 'prop-types';
import InlineSVG from 'svg-inline-react';
import styled from 'styled-components';

import leftArrow from 'icons/left_arrow.svg';
import rightArrow from 'icons/right_arrow.svg';

const ArrowSelect = ({ setValue, name, options, value }) => {
   const currentIndex = options.findIndex(option => option === value);

   const onRightArrow = e => {
      e.preventDefault();
      if (currentIndex + 1 >= options.length) return;
      setValue(options[currentIndex + 1]);
   };

   const onLeftArrow = e => {
      e.preventDefault();
      if (currentIndex - 1 < 0) return;
      setValue(options[currentIndex - 1]);
   };

   return (
      <Container>
         <Button htmlFor={name} onClick={onLeftArrow}><InlineSVG src={leftArrow} /></Button>
         <span>{value.replace('#', '\u266F').replace('b', '\u266D')}</span>
         <Button htmlFor={name} onClick={onRightArrow}><InlineSVG src={rightArrow} /></Button>
      </Container>
   );
};

ArrowSelect.propTypes = {
   setValue: PropTypes.func,
   name: PropTypes.string,
   options: PropTypes.arrayOf(PropTypes.string),
   value: PropTypes.string,
};

const Container = styled.span`
   line-height: 3rem;
   font-size: 1.6rem;
   margin: 0.8rem 0;
   &:first-child {
      margin-top: 0;
   }
   &:last-child {
      margin-bottom: 0;
   }
   span {
      display: inline-block;
      width: 3rem;
   }
`;

const Button = styled.button`
   position: relative;
   top: 4px;
   /* appearance: none; */
   border: none;
   background: none;
   margin: 0 0.8rem;
   &:first-child {
      margin-left: 0;
   }
   &:last-child {
      margin-right: 0;
   }
   svg {
      height: 20px;
      width: 20px;
   }
`;

export default ArrowSelect;
