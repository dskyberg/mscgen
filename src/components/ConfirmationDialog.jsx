import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography'

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


function ConfirmationDialog(props) {
  const { title, message, onClose,  open, cancelLabel, okLabel, ...other } = props;
  const classes = useStyles()

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
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
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" className={classes.message}>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          {cancelLabel}
        </Button>
        <Button onClick={handleOk} color="primary">
          {okLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
ConfirmationDialog.defaultProps = {
  cancelLabel: 'Cancel',
  okLabel: 'Ok',
}
export default ConfirmationDialog