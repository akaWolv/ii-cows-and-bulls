import { Tooltip } from '@mui/material';
// import CloudOffIcon from '@mui/icons-material/CloudOff';
import PauseIcon from '@mui/icons-material/Pause';
import Colors from 'constants/Colors.ts';
import SessionContext from 'context/SessionContext.ts';
import { useContext } from 'react';
import { GameStatus } from 'constants/GameStatus.ts';

export default function StatusIconSuspended() {
  const {game} = useContext(SessionContext); //, isPlayerConnected, isOpponentConnected
  const {status} = game

  return (
    <div style={{position: 'absolute', right: 5, top: 5}}>
      {
        status == GameStatus.SUSPENDED && (
          <Tooltip title="Game suspended">
            <PauseIcon sx={{fontSize: 20, color: Colors.IMP_DIM_WHITE}}/>
          </Tooltip>
        )
      }
      {/*{*/}
      {/*  (!isPlayerConnected || !isOpponentConnected) && (*/}
      {/*    <Tooltip title="Connection interrupted">*/}
      {/*      <CloudOffIcon sx={{fontSize: 20, color: Colors.IMP_RED_BAD}}/>*/}
      {/*    </Tooltip>*/}
      {/*  )*/}
      {/*}*/}
    </div>
  );
}
