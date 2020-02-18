import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

function Action(props) {
    const {onClose} = props
    return (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={ onClose }>
                <CloseIcon fontSize="small" />
            </IconButton>
         </React.Fragment>
    )
}

export default function Message(props) {
    const {message, open, onClose} = props
    return (
        <Snackbar anchorOrigin={ { vertical: 'bottom', horizontal: 'left', } } open={ open } autoHideDuration={ 6000 } onClose={ onClose } message={ message }
        action={ <Action onClose={ onClose }/> } 
        />

    )
} 
