/**
* Copyright (c) 2020 David Skyberg and Swankymutt.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* OpenFileDialog.jsx
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


