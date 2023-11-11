import React from 'react'

type Props = {
  events: never[]
}

const ConnectionState: React.FC<Props> = ({events}) => {
  return (
    <>
      <ul>
        {
          events.map((event, index) =>
            <li key={index}>{event}</li>
          )
        }
      </ul>
    </>
  );
}

export default ConnectionState
