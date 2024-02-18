import styled from 'styled-components'

const StyledNumberPickerContainer = styled.div<{
  $disabled?: boolean
}>`
  padding: 5px 0 0 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: ${({ $disabled }) => $disabled ? '0.3' : '1'};
  filter: blur(${({ $disabled }) => $disabled ? '2px' : '0'});
`

export {
  StyledNumberPickerContainer
}
