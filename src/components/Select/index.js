import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import keyGen from 'weak-key';

const Select = ({ name, options, value, setState }) => {
   const handleChange = e => setState(e.target.value);

   return (
      <Styled name={name} value={value} onChange={handleChange}>
         {options.map(option => (
            <option
               key={keyGen({ name, option })} // weak-key only hashes objects
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
   setState: PropTypes.func,
};

const Styled = styled.select``;

export default Select;
