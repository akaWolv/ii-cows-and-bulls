import styled from 'styled-components'
import Colors from 'constants/Colors.ts';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Card } from '@mui/material'

const StyledCard = styled(Card)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #000;
    outline: 0;
    background-color: ${Colors.IMP_DARK_GREY} !important;
    width: 375px;
    @media (max-width: 500px) {
        width: 95vw;
        height: 98vh;
    }
`

const StyledIconForButton = styled(HelpOutlineOutlinedIcon)`
  color: ${Colors.IMP_ORANGE};
`

export {
  StyledCard,
  StyledIconForButton,
}
