/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SaveIcon from '@material-ui/icons/Save'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser'
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Tooltip from '@material-ui/core/Tooltip';
import rightMethod from '../assets/rightMethod.svg'
import rightCallback from '../assets/rightCallback.svg'
import rightSignal from '../assets/rightSignal.svg'

export const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    height: '100%',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: '100%',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },

});


class AppDrawer extends React.Component {

  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
  }

  render() {
    const {classes, open, onClose, onClick} = this.props
    return (
      <Drawer variant="permanent" classes={ { paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose), } } open={ open }>
        <div className={ classes.toolbarIcon }>
          <IconButton onClick={ onClose }>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
        <ListItem button onClick={event => onClick(event, "reset")}>
          <Tooltip title="Reset editor to default" aria-label="Reset editor to default">
            <ListItemIcon>
              <ClearAllIcon />
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Reset Editor" />
          </ListItem>

        <ListItem button onClick={event => onClick(event, "save")}>
        <Tooltip title="Save editor and preview to file" aria-label="Save editor and preview to file">
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Save File" />
          </ListItem>

          <ListItem button onClick={event => onClick(event, "open")}>
          <Tooltip title="Open a file into the editor" aria-label="Open a file into the editor">
            <ListItemIcon>
              <OpenInBrowserIcon />
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Open File" />
          </ListItem>

          <ListItem button onClick={event => onClick(event, "method")}>
          <Tooltip title="Add a method arc" aria-label="Add a method arc">
            <ListItemIcon>
              <img src={rightMethod} width="36" alt="method"/>
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Add method" />
          </ListItem>

          <ListItem button onClick={event => onClick(event, "signal")}>
          <Tooltip title="Add a signal arc" aria-label="Add a signal arc">
            <ListItemIcon>
              <img src={rightSignal} width="36" alt="signal"/>
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Add signal" />
          </ListItem>

          <ListItem button onClick={event => onClick(event, "callback")}>
          <Tooltip title="Add a callback arc" aria-label="Add a callback arc">
            <ListItemIcon>
              <img src={rightCallback} width="36" alt="calback"/>
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Add callback" />
          </ListItem>

         </List>
      </Drawer>
      );
  }
}
export default withStyles(styles)(AppDrawer)

