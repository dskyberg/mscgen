import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Input from '@material-ui/core/Input'
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
    console.log('Dialog.handleClose called')
    onClose(value);
  };

  let fileReader

  const handleFileRead = e => {
    const content = fileReader.result
    setValue(content)
  }
  const handleChange = (event) => {
    console.log('Dialog.handleChange called', event.target.files[0])
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
      <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
      <Input type="file" onChange={ handleChange } />
    </Dialog>
    );
}

OpenFileDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};


