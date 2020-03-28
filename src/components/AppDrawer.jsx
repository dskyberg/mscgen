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
* AppDrawer.jsx
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
import HelpIcon from '@material-ui/icons/Help'
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
  value: PropTypes.string.isRequired,
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

  handleHelpClick = (event) => {
    window.open('https://mscgen.js.org/tutorial.html#mscgen', '_blank')
  }

  /**
   * The icons above the divider produce code snippets and add to the editor
   * at the current cursor location.
   *
   * The icons below the divider are file mgt actions.
   */
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
            value="help"
            onClick={this.handleHelpClick}
            text="Help"
            toolTip="MSCGen syntax help"
            icon={<HelpIcon/>}
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

          <Divider/>

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
         </List>
      </Drawer>
      );
  }
}
export default AppDrawer

