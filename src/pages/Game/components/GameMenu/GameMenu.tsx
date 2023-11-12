import * as React from 'react';
import { Menu, MenuItem, Divider, IconButton, Typography } from '@mui/material';
import { StyledIconConnected, StyledIconDisconnected, StyledIconForButton } from './GameMenu.styled';
import { GameCode, UserCode } from 'types/CommonTypes.ts';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import SocketContext from 'context/SocketContext.ts';
import { QUIT_GAME } from 'constants/SocketMessages.ts';

type Props = {
  gameCode: GameCode
  userCode: UserCode
  isPlayerConnected: boolean
  isOpponentConnected: boolean
}

const GameMenu: React.FC<Props> = ({gameCode, userCode, isPlayerConnected, isOpponentConnected}) => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleQuit = () => {
    socket.emit(QUIT_GAME);
    navigate('/')
  }

  const renderIsConnectedIcon = (status: boolean) => status ? <StyledIconConnected /> : <StyledIconDisconnected />

  return (
    <>
      <IconButton aria-label="help" onClick={handleClick}>
        <StyledIconForButton />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Typography variant='h6'>Game code:</Typography>
        <Typography variant='body1'>{gameCode}</Typography>
        <Typography variant='h6' sx={{ mt: 1 }}>Player code:</Typography>
        <Typography variant='body1'>{userCode}</Typography>
        <Typography variant='h6' sx={{ mt: 1 }}>Connection:</Typography>
        <Typography variant='body1'>{renderIsConnectedIcon(isPlayerConnected)} You</Typography>
        <Typography variant='body1'>{renderIsConnectedIcon(isOpponentConnected)} Opponent</Typography>
        <Divider sx={{ mb: 1, mt: 1 }} />
        <MenuItem onClick={handleQuit}>Quit game</MenuItem>
      </Menu>
    </>
  );
}

export default GameMenu
