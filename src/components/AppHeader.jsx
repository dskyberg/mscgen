import React from 'react'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Tltle from './Title'

import { drawerWidth } from './AppDrawer'

const styles = theme => ({
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
});

class AppHeader extends React.Component {

    render() {

        const {onDrawerClick, title, badgeContent, classes, open} = this.props
        return (

            <AppBar position="absolute" className={ clsx(classes.appBar, open && classes.appBarShift) }>
              <Toolbar className={ classes.toolbar }>
                <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={ onDrawerClick } className={ clsx(classes.menuButton, open && classes.menuButtonHidden) }>
                  <MenuIcon />
                </IconButton>
                <Tltle className={ classes.title }>
                  {title}
                </Tltle>
                <IconButton color="inherit">
                  <Badge badgeContent={ badgeContent } color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Toolbar>
            </AppBar>
        )
    }
}
export default withStyles(styles)(AppHeader)