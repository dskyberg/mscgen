/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import Tltle from './Title'

import { drawerWidth } from './AppDrawer'

const useStyles = makeStyles(theme => ({
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
    logo: {
        maxWidth: 36,
        marginRight: 20,
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
}));

function AppHeader(props){
    const {onDrawerClick, title, onSettingsClick, open} = props
    const classes = useStyles()
    return (
        <AppBar position="fixed" className={ clsx(classes.appBar, open && classes.appBarShift) }>
            <Toolbar className={ classes.toolbar }>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={ onDrawerClick } className={ clsx(classes.menuButton, open && classes.menuButtonHidden) }>
                <MenuIcon />
            </IconButton>
            <img src="logo.png" alt="logo" className={classes.logo} />
            <Tltle className={ classes.title }>
                {title}
            </Tltle>
            <IconButton color="inherit" onClick={onSettingsClick}>
                <SettingsIcon/>
            </IconButton>
            </Toolbar>
        </AppBar>
    )
}
export default AppHeader