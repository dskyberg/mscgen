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

function DrawerListItem(props) {
  return (
    <ListItem button onClick={event => props.onClick(event, props.value)}>
    <Tooltip title={props.toolTip} aria-label={props.toolTip}>
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        </Tooltip>
        <ListItemText primary={props.text} />
      </ListItem>
  )
}
DrawerListItem.propTypes = {
  value: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  toolTip: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
}

@withStyles(styles)
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
          <DrawerListItem
            value="reset"
            onClick={onClick}
            text="Reset Editor"
            toolTip="Reset editor to default"
            icon={<ClearAllIcon/>}
          />
          <DrawerListItem
            value="save"
            onClick={onClick}
            text="Save File"
            toolTip="Save editor and preview to file"
            icon={<SaveIcon/>}
          />
          <DrawerListItem
            value="open"
            onClick={onClick}
            text="Open File"
            toolTip="Open a file into the editor"
            icon={<OpenInBrowserIcon/>}
          />
          <DrawerListItem
            value="method"
            onClick={onClick}
            text="Add method"
            toolTip="Add a method arc"
            icon={<img src={rightMethod} width="36" alt="method"/>}
          />
          <DrawerListItem
            value="signal"
            onClick={onClick}
            text="Add signal"
            toolTip="Add a signal arc"
            icon={<img src={rightSignal} width="36" alt="signal"/>}
          />
          <DrawerListItem
            value="callback"
            onClick={onClick}
            text="Add callback"
            toolTip="Add a callback arc"
            icon={<img src={rightCallback} width="36" alt="callback"/>}
          />
         </List>
      </Drawer>
      );
  }
}
export default AppDrawer

