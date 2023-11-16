import React, { useEffect, useState } from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { useCookies } from 'react-cookie';
import { StyledIconForButton } from 'pages/Game/components/Help/Help.styled.tsx';
import { ONE_TIME_HELP_DISPLAYED } from 'constants/CookiesName.ts';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  outline: 0
}

const Help: React.FC = () => {
  const [{oneTimeHelpDisplay}, setCookie] = useCookies([ONE_TIME_HELP_DISPLAYED]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    !oneTimeHelpDisplay && setCookie(ONE_TIME_HELP_DISPLAYED, true, {path: '/', maxAge: (365 * 24 * 60 * 60)})
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
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Goal
          </Typography>
          <Typography sx={{mt: 1, mb: 2}}>
            Each player tries to guess opponents number.
          </Typography>
          <Typography variant="h6" component="h2">
            Guessing
          </Typography>
          <Typography sx={{mt: 1, mb: 2}}>
            Provide number and click 'pick" button.
            <br/>
            Now wait for opponent.
          </Typography>
          <Typography variant="h6" component="h2">
            Answer
          </Typography>
          <Typography sx={{mt: 1, mb: 1}}>
            You get answer after each try.
            <br/>
            Every circle is a hint about digits in your guess:
          </Typography>

          <Typography variant="caption" sx={{fontWeight: 200}}>
            <RadioButtonUncheckedOutlinedIcon style={{opacity: 0.8, verticalAlign: 'text-top'}}/>
            &nbsp;a digit is found but is in <b>wrong place</b>
            <br/>
            <CheckCircleTwoToneIcon style={{opacity: 0.8, verticalAlign: 'text-top'}}/>
            &nbsp;a digit is found in <b>right place!</b>
          </Typography>

          <Typography sx={{mt: 1, mb: 2}}>
            However you never know which digit is hint about.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default Help
