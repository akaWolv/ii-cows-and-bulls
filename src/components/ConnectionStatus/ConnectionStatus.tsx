import { Chip, Tooltip } from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SessionContext from 'context/SessionContext.ts';
import { useContext } from 'react';
import { GameStatus } from 'constants/GameStatus.ts';

export default function ConnectionStatus() {
  const {game} = useContext(SessionContext); //, isPlayerConnected, isOpponentConnected
  const {status} = game

  return (
    <div style={{position: 'absolute', right: 5, top: 5}}>
      {
        status == GameStatus.SUSPENDED && (
          <Tooltip title="Waiting for opponent to connect">
            <Chip
              icon={<CloudOffIcon />}
              label="waiting..."
              size="small"
              color="warning"
            />
          </Tooltip>
        )
      }
      {
        status == GameStatus.PREPARE && (
          <Tooltip title="Players connected">
            <Chip
              icon={<CloudDoneIcon />}
              label="Connected"
              size="small"
              color="success"
            />
          </Tooltip>
        )
      }
    </div>
  );
}
