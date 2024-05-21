import { Button } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import React from 'react';

type Props = {
  textToCopy: string
  buttonText: string
}
const CopyToClipboardButton: React.FC<Props> = ({textToCopy, buttonText}) => {
  const handleOnClick = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        /* clipboard successfully set */
      },
      () => {
        console.error('Failed to copy')
      },
    );  }
  return (
    <Button variant="outlined" size="small" endIcon={<LinkIcon />} onClick={handleOnClick} sx={{textTransform: 'none'}}>
      {buttonText}
    </Button>
  );
}

export default CopyToClipboardButton
