import React, { useContext, useEffect, useState } from 'react'
import { Alert, AlertColor, AlertTitle } from '@mui/material';
import { MSG_ERROR } from "constants/SocketMessages.ts";
import SocketContext from 'context/SocketContext.ts';
import { StyledAlertContainer } from './Growler.styled.tsx';

type Props = {
  size?: 'sm' | 'md'
}

type handleErrorMessage = { text: string }

const Growler: React.FC<Props> = () => {
  const socket = useContext(SocketContext);
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const handleErrorMessage = ({text}: handleErrorMessage) => {
      setSeverity('error')
      setIsVisible(true)
      setMessage(text || 'Error occurred')
      setTimeout(() => { setIsVisible(false) }, 4000)
    }
    socket.on(MSG_ERROR, handleErrorMessage);

    return () => {
      socket.off(MSG_ERROR, handleErrorMessage);
    };
  }, []);

  return (
    isVisible && (
      <StyledAlertContainer>
        <Alert
          onClose={() => {
            setIsVisible(false)
          }}
          severity={severity}
        >
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      </StyledAlertContainer>
    )
  )
}

export default Growler
