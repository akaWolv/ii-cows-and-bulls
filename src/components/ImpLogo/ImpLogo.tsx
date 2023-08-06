import React from 'react'
import logo from '../../indieimp.svg';
import { StyledLogo } from './ImpLogo.styled';

const ImpLogo: React.FC = () => {
  return <StyledLogo src={logo} className="App-logo" alt="logo"/>
}

export default ImpLogo
