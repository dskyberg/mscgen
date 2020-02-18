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
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import SaveIcon from '@material-ui/icons/Save'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser'
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
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
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Integrations" />
          </ListItem>
          <ListItem button onClick={event => onClick(event, "save")}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary="Save File" />
          </ListItem>
          <ListItem button onClick={event => onClick(event, "open")}>
            <ListItemIcon>
              <OpenInBrowserIcon />
            </ListItemIcon>
            <ListItemText primary="Open File" />
          </ListItem>
         </List>
      </Drawer>
      );
  }
}
export default withStyles(styles)(AppDrawer)

