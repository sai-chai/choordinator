import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import keyGen from 'weak-key';

const Select = ({ name, options, value, setValue }) => {
   const handleChange = e => {
      setValue(e.target.value);
      e.target.blur();
   };

   return (
      <Styled name={name} value={value} onChange={handleChange}>
         {options.map(option => (
            <option
               key={keyGen({ name, option, value })} // weak-key only hashes objects
               value={option}
            >
               {option}
            </option>
         ))}
      </Styled>
   );
};

Select.propTypes = {
   name: PropTypes.string,
   options: PropTypes.arrayOf(PropTypes.string),
   value: PropTypes.string,
   setValue: PropTypes.func,
};

const Styled = styled.select`
   height: 3rem;
   font-size: 1.6rem;
   margin: 0.8rem 0;
   &:first-child {
      margin-top: 0;
   }
   &:last-child {
      margin-bottom: 0;
   }
`;

export default Select;
