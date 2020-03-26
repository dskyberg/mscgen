import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import editorConfig from '../store/EditorConfig';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
  message: {
    margin: 20
  }
}));


function SaveFileDialog(props) {
  const [name, setName] = React.useState(editorConfig.name)
  const { title, message, onClose,  open, cancelLabel, okLabel, ...other } = props;
  const classes = useStyles()


  const handleCancel = () => {
    onClose();
  };

  const handleChange = (event) => {
    setName(event.target.value)
  }

  const handleOk = () => {
    editorConfig.setName(name)
    onClose(true);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Save Files</DialogTitle>
      <DialogContent dividers>
        <form  noValidate autoComplete="off">
          <TextField
              id="file-name"
              label="File name"
              defaultValue="my_mscgen_file"
              value={name}
              autoFocus={true}
              fullWidth={true}
              onChange={handleChange}
              inputRef={input => input && input.focus()}
            />
        </form>
        <Typography variant="body1" className={classes.message}>
            If no name is provided, a timestamp will be used.
        </Typography>
        <Typography variant="body1" className={classes.message}>
          An extension that matches the type of msg script will be appended.</Typography>
        <Typography variant="body1" className={classes.message}>
            The rendered diagram (visible in the Preview pane) will be saved to the
            same filename with an extension of 'svg'.
        </Typography>

      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SaveFileDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
export default SaveFileDialog