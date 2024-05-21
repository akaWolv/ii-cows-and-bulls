import styled from 'styled-components'

import { Alert } from '@mui/material';
import Colors from 'constants/Colors';

const StyledAlert = styled(Alert)`
    width: 95%;
    padding: 0.25em 0.5em !important;
    margin: 0 !important;
    background-color: ${Colors.IMP_LIGHT_GREY} !important;
    color: ${Colors.IMP_DIM_WHITE} !important;
    opacity: 0.8;

    text-align: center;
    font-weight: 200;
`

const RichContentContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`
const RichContentSection = styled.div`
    display: flex;
    align-items: center;
`

export {
  RichContentContainer,
  RichContentSection,
  StyledAlert
}
