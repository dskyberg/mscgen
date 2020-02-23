import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});


export default function OpenFileDialog(props) {
  const [value, setValue] = React.useState(null);
  const classes = useStyles();
  const {onClose, open} = props;


  const handleClose = (event) => {
    console.log('OpenFileDialog.handleClose called')
    onClose(value);
  };

  let fileReader

  const handleFileRead = e => {
    const content = fileReader.result
    onClose(content);
  }

  const handleChange = (event) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead
    try {
      fileReader.readAsText(event.target.files[0])
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Dialog onClose={ handleClose } aria-labelledby="simple-dialog-title" open={ open }>
      <DialogTitle id="simple-dialog-title">Open an MSCGen file</DialogTitle>
      <Button component="label">
        <input id="dialog-file-input" type="file" onChange={ handleChange } style={{ display: 'none' }}/>
        Upload a File
      </Button>
    </Dialog>
    );
}

OpenFileDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};


