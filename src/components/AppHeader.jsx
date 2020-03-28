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
* AppHeader.jsx
*/
import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import TabIcon from '@material-ui/icons/Tab'
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import GitHubIcon from '@material-ui/icons/GitHub'
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

function doGitHub() {
    window.open('https://github.com/dskyberg/mscgen', '_blank')
}

function AppHeader(props){
    const {onDrawerClick, title, name, onSettingsClick, onModeClick, mode, open} = props
    const classes = useStyles()
    const modeIcon =  mode === 'tabs' ? <VerticalSplitIcon/> : <TabIcon/>
    const modeTitle = mode === 'tabs' ? 'Use split view' : 'Use tabbed view'
    return (
        <AppBar position="fixed" className={ clsx(classes.appBar, open && classes.appBarShift) }>
            <Toolbar className={ classes.toolbar }>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={ onDrawerClick } className={ clsx(classes.menuButton, open && classes.menuButtonHidden) }>
                <MenuIcon />
            </IconButton>
            <img src="logo.png" alt="logo" className={classes.logo} />
            <Tltle className={ classes.title }>
                {`${title} [${name}]`}
            </Tltle>
            <Tooltip title={modeTitle} aria-label={modeTitle}>
                <IconButton color="inherit" onClick={onModeClick}>
                    { modeIcon }
                </IconButton>
            </Tooltip>
            <IconButton color="inherit" onClick={doGitHub}>
                <GitHubIcon/>
            </IconButton>
            <IconButton color="inherit" onClick={onSettingsClick}>
                <SettingsIcon/>
            </IconButton>
            </Toolbar>
        </AppBar>
    )
}
export default AppHeader