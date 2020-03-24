/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import SplitPane from 'react-split-pane'
import {drawerWidth} from './AppDrawer'


const useStyles = makeStyles(theme => ({
  splitPane: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: 'hidden',
  },
  splitPaneClose: {
    overflow: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(9),
    },
  }
}))

function Splitter(props) {
    const {open} = props
    const classes = useStyles()
    const savedSplitPos = localStorage.getItem('splitPos')
    let splitPos
    if( savedSplitPos === null ){
      splitPos = 500
    } else {
      splitPos = parseInt(savedSplitPos, 10)
    }

    return (
            <SplitPane className={clsx(classes.splitPane, !open && classes.splitPaneClose)}
              split="vertical"
              defaultSize={splitPos} primary="second"
              onChange={ size => localStorage.setItem('splitPos', Math.floor(size)) }>
                {props.children}
            </SplitPane>
    )
}
export default Splitter

