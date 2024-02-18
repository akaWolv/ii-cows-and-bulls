import React, { useEffect, useState } from 'react'
import { Avatar, Card, CardActions, CardContent, Chip, Paper, Tooltip, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import NumbersIcon from '@mui/icons-material/Numbers';
import { useSearchParams } from 'react-router-dom'

import { Game, Store, User } from 'types/CommonTypes.ts'
import Colors from 'constants/Colors.ts'
import { UserStatus } from 'constants/UserStatus.ts'

const Admin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key")
  const [data, setData] = useState<undefined | Store>(undefined);

  useEffect(() => {
    fetch(`/api/admin/getall`, { headers: { Authorization: String(key) }})
      .then(response => {
        if (response.status!==200)
        {
          throw new Error(`API has responded with status: ${String(response.status)}`)
        }
        return response.json()
      })
      .then(json => setData(json as Store))
      .catch(error => {
        console.error(error);
      });
  }, []);

  const { games } = data || {}

  const getColorStatusByStatus = (status: UserStatus) => {
    if ([UserStatus.CONNECTED].includes(status)) {
      return "success"
    }
    return 'secondary'
  }

  const renderUser = ({ id, code, codeHash, status, guesses, isWin, number }: User) => {
    return (
      <Card elevation={3} key={id}
            sx={{ padding: 1, backgroundColor: Colors.IMP_LIGHT_GREY, flexGrow: 1, flexBasis: 0 }}>
        <CardContent sx={{ padding: 1 }}>
          <Tooltip title={codeHash}>
            <Chip variant="outlined" icon={<VpnKeyIcon />} sx={{ float: 'right' }} label="Hash" size="small" />
          </Tooltip>

          <Typography variant="subtitle2">Player</Typography>
          <Typography variant="subtitle2" gutterBottom><b>{code}</b></Typography>

          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 5,
            marginBottom: 10
          }}>
            <Chip icon={<NumbersIcon />} label={number || '- - - -'} size="small" />
            <Chip avatar={<Avatar>{guesses.length}</Avatar>} label="Rounds" size="small" />
          </div>

          <Typography variant="subtitle2">
            {
              guesses
                .map(({ number, cows, bulls }) => (
                    <React.Fragment key={number}>
                      <Tooltip title={`Cows: ${cows}, Bulls: ${bulls}`}><span>{number}</span></Tooltip>{', '}
                    </React.Fragment>
                  )
                )
            }
          </Typography>
        </CardContent>
        <CardActions>
          <Chip label={status} variant="outlined" size="small" color={getColorStatusByStatus(status)} />
          {isWin && <Chip icon={<StarIcon />} label="Win" size="small" color="primary" />}
        </CardActions>
      </Card>
    )
  }
  const renderEmptyUser = (id: number) => {
    return (
      <Paper elevation={3} key={id} sx={{ backgroundColor: 'grey', flexGrow: 1, flexBasis: 0 }}>
        <Typography variant="body2" gutterBottom>Player <br /><b><i>unknown</i></b></Typography>
      </Paper>
    )
  }
  const renderGame = ({ code, users }: Game) => {
    return (
      <Paper key={code}>
        <Typography variant="body1" gutterBottom>Game <b>{code}</b></Typography>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-evenly',
          gap: 5
        }}>
          {users.map((user) => renderUser(user))}
          {users.length < 2 && renderEmptyUser(1)}
        </div>
      </Paper>
    )
  }

  if (!data) {
    return <center>Loading...</center>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 8
      }}>
      <Paper sx={{ marginTop: '10px', textAlign: 'center' }}>
        Games: <b>{games?.length || 0}</b>
      </Paper>
      {games?.reverse().map((game) => renderGame(game))}
      {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </div>
  )
}

export default Admin
