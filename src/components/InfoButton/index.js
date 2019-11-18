import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';

const InfoButton = (onClick) => (
   <Wrapper onClick={onClick} >
      <FaIcon icon="info-circle" />
   </Wrapper>
);

const Wrapper = styled.button`
   height: 50px;
   background: transparent;
   color: #fff;
   border: none;
   margin-left: 30px;
`;

export default InfoButton;
