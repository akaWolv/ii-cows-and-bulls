import styled from 'styled-components';
import { Paper } from '@mui/material';
import Colors from 'constants/Colors';

const StyledPageContainer = styled(Paper)<{
  $dense?: boolean
}>`
  position: relative;
  width: 350px;
  min-height: ${({ $dense }) => $dense ? '60vh' : '80vh'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $dense }) => $dense ? 'space-evenly' : 'flex-start'};
    
  background-color: ${Colors.IMP_DARK_GREY} !important;
`

export {
  StyledPageContainer
}
