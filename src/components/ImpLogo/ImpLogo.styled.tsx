import styled from 'styled-components'

const StyledLogo = styled.img<{
  $size: 'sm' | 'md'
}>`
  width: ${({ $size }) => $size === 'sm' ? '40px' : '140px'};
  pointer-events: none;
  margin: 0.7em;
`

export {
  StyledLogo
}
