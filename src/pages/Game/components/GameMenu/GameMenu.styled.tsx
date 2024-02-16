import styled from 'styled-components'
import Colors from 'constants/Colors.ts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudDoneTwoToneIcon from '@mui/icons-material/CloudDoneTwoTone';
import CloudOffTwoToneIcon from '@mui/icons-material/CloudOffTwoTone';

const StyledIconForButton = styled(MoreVertIcon)`
    color: ${Colors.IMP_ORANGE};
`
const StyledIconConnected = styled(CloudDoneTwoToneIcon)`
    color: ${Colors.IMP_LIGHT_GREEN};
    vertical-align: middle;
    margin-bottom: 5px;
    margin-right: 5px;
`
const StyledIconDisconnected = styled(CloudOffTwoToneIcon)`
    color: ${Colors.IMP_RED_BAD};
    vertical-align: middle;
    margin-bottom: 5px;
    margin-right: 5px;
`

export {
  StyledIconForButton,
  StyledIconConnected,
  StyledIconDisconnected,
}
