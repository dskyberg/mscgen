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
* Splitter.jsx
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

