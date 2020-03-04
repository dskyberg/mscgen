/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import editorConfig from '../store/EditorConfig'


export default function OpenFileDialog(props) {
  const {onClose, open} = props;


  const handleClose = (event) => {
    onClose(null);
  };


  const handleChange = (event) => {
    editorConfig.openFile(event.target.files[0], onClose)
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


