import * as React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Menu, MenuItem, Divider, IconButton, Typography, Paper } from '@mui/material';
import { StyledIconConnected, StyledIconDisconnected, StyledIconForButton } from './GameMenu.styled';
import { GameCode, UserCode } from 'types/CommonTypes.ts';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import SocketContext from 'context/SocketContext.ts';
import { MSG_QUIT_GAME } from 'constants/SocketMessages.ts';
import LinkIcon from '@mui/icons-material/Link';
import CancelIcon from '@mui/icons-material/Cancel';

type Props = {
  gameCode: GameCode
  userCode: UserCode
  isPlayerConnected: boolean
  isOpponentConnected: boolean
}

const GameMenu: React.FC<Props> = ({ gameCode, userCode, isPlayerConnected, isOpponentConnected }) => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleQuit = () => {
    socket.emit(MSG_QUIT_GAME);
    navigate('/')
  }

  const renderIsConnectedIcon = (status: boolean) => status ? <StyledIconConnected /> : <StyledIconDisconnected />

  const handleCopyGameLink = () => {
    navigator.clipboard.writeText(`${location.origin}/join/${gameCode}`).then(
      () => {
        /* clipboard successfully set */
      },
      () => {
        console.error('Failed to copy')
      },
    );
    setIsLinkCopied(true)
  }

  return (
    <>
      <IconButton aria-label="help" onClick={handleClick}>
        <StyledIconForButton />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper elevation={0} style={{width: '175px'}}>
          <Typography variant='h6'>Game code:</Typography>
          <Typography variant='body1'>{gameCode}</Typography>
          <Typography variant='h6' sx={{ mt: 1 }}>Player code:</Typography>
          <Typography variant='body1'>{userCode}</Typography>
          <Typography variant='h6' sx={{ mt: 1 }}>Connections:</Typography>
          <Typography variant='body1'>{renderIsConnectedIcon(isPlayerConnected)} You</Typography>
          <Typography variant='body1'>{renderIsConnectedIcon(isOpponentConnected)} Opponent</Typography>
        </Paper>
        <Divider sx={{ mb: 1, mt: 1 }} />
        <MenuItem onClick={handleCopyGameLink}>
          <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{isLinkCopied ? <>Link copied!</> : "Copy game link"}</ListItemText>
        </MenuItem>
        <Divider sx={{ mb: 1, mt: 1 }} />
        <MenuItem onClick={handleQuit}>
          <ListItemIcon><CancelIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Quit game</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default GameMenu
