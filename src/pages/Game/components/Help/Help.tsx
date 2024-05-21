import React, { useEffect, useState } from 'react';
import {
  Button,
  CardContent,
  IconButton,
  Modal,
  Paper,
  Typography
} from '@mui/material';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { useCookies } from 'react-cookie';
import { StyledCard, StyledIconForButton } from 'pages/Game/components/Help/Help.styled.tsx';
import { ONE_TIME_HELP_DISPLAYED } from 'constants/CookiesName.ts';

const Help: React.FC = () => {
  const [{ oneTimeHelpDisplay }, setCookie] = useCookies([ONE_TIME_HELP_DISPLAYED]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    !oneTimeHelpDisplay && setCookie(ONE_TIME_HELP_DISPLAYED, true, { path: '/', maxAge: (365 * 24 * 60 * 60) })
  }

  useEffect(() => void (!oneTimeHelpDisplay && setOpen(true)), [oneTimeHelpDisplay])

  return (
    <>
      <IconButton aria-label="help" onClick={handleOpen}>
        <StyledIconForButton />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <StyledCard>
          <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Typography variant="h3" component="h3" gutterBottom>
              Rules
            </Typography>
            <Typography variant="h6" component="h6">
              Goal
            </Typography>
            <Typography variant="body2" gutterBottom>
              Each player tries to guess opponents number.
            </Typography>

            <Typography variant="h6" component="h6">
              Game
            </Typography>
            <Typography variant="body2" gutterBottom>
              Provide number and click 'pick" button.
              <br />
              Wait for opponent...
            </Typography>

            <Typography variant="h6" component="h6">
              Answer
            </Typography>
            <Typography variant="body2" gutterBottom>
              You get answer when both players will pick a guess.<br />
              Multiple hints will be provided to you.<br />
              Use them to correct your next guess.
            </Typography>

            <Paper>
              <Typography variant="h6" component="h6"><b>Hints:</b></Typography>
              <Typography variant="body1">
                <RadioButtonUncheckedOutlinedIcon style={{ opacity: 0.8, verticalAlign: 'middle' }} />
                &nbsp;one of digits is <b>found</b> in <b>wrong place</b>
                <br />
                <CheckCircleTwoToneIcon style={{ opacity: 0.8, verticalAlign: 'middle' }} />
                &nbsp;one of digits is <b>found</b> in <b>right place</b>
              </Typography>
            </Paper>

            <Typography variant="h6" component="h6">
              Remember
            </Typography>
            <Typography variant="body2" gutterBottom>
              You never know which digit is hint about.
            </Typography>
            <br />
            <Button variant="outlined" onClick={handleClose}>OK</Button>
          </CardContent>
        </StyledCard>
      </Modal>
    </>
  );
}

export default Help
