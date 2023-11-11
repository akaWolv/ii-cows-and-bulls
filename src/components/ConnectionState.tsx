import React from 'react'

type Props = {
  isConnected: boolean
}

const ConnectionState: React.FC<Props> = ({ isConnected }) => {
  return <p>State: { '' + isConnected }</p>;
}

export default ConnectionState
