import React from 'react'
import logo from '../../indieimp.svg';
import { StyledLogo } from './ImpLogo.styled';

type Props = {
  size?: 'sm' | 'md'
}

const ImpLogo: React.FC<Props> = ({ size = 'md' }) => {
  return <StyledLogo src={logo} className="App-logo" alt="logo" $size={size} />
}

export default ImpLogo
