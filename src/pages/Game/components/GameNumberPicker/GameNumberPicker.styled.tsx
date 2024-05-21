import styled from 'styled-components'
import { Button } from '@mui/material';

const StyledPickerBlend = styled.div`
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
`
const StyledButtonContainer = styled.div<{
  $disabled?: boolean
}>`
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  padding: 0 0 0 1em;
  margin: 0;
  opacity: ${({ $disabled }) => $disabled ? '0.3' : '1'};
  filter: blur(${({ $disabled }) => $disabled ? '3px' : '0'});
`
const StyledButton = styled(Button)`
  height: 62px;
  width: 80px !important;
  min-width: 80px !important;
  padding: 0;
  margin: 0;
`

export {
  StyledButtonContainer,
  StyledButton,
  StyledPickerBlend,
}
