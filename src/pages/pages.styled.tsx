import styled from 'styled-components';
import { Paper } from '@mui/material';
import Colors from 'constants/Colors';

const StyledPageContainer = styled(Paper)<{
  $dense: boolean
}>`
  width: 350px;
  min-height: ${({ $dense }) => $dense ? '60vh' : '80vh'};
  display: flex;
  justify-content: ${({ $dense }) => $dense ? 'center' : 'flex-start'};;
  align-items: center;
  flex-direction: column;
  background-color: ${Colors.IMP_DARK_GREY} !important;
`

export {
  StyledPageContainer
}
