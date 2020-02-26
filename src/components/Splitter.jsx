import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import styled from "styled-components";
import SplitPane from 'react-split-pane'
import {drawerWidth} from './AppDrawer'

/*
  The react-split-pane component does not use MUI styles, and looks for
  globally defined css class names.
*/
const Wrapper = styled.div`
  .Resizer {
    box-sizing: border-box;
    background: #000;
    opacity: 0.5;
    z-index: 1;
    background-clip: padding-box;
  }

  .Resizer:hover {
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }

  .vertical section {
    width: 100vh;
    height: 100vh;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  .vertical header {
    padding: 1rem;
    background: #eee;
  }

  .vertical footer {
    padding: 1rem;
    background: #eee;
  }
  .parent {
    width: 100%;
    height: 100%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .header {
    background: #aaa;
    height: 3rem;
    line-height: 3rem;
  }
  .wrapper {
    background: #ffa;
    margin: 5rem;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
`;


const styles = makeStyles(theme => ({
  splitPane: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  splitPaneClose: {
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


const Splitter = (props) => {
    const {open} = props
    const classes = styles()
    const savedSplitPos = localStorage.getItem('splitPos')
    let splitPos
    if( savedSplitPos === null ){
      splitPos = 500
    } else {
      splitPos = parseInt(savedSplitPos, 10)
    }

    return (
        <Wrapper >
            <SplitPane className={clsx(classes.splitPane, !open && classes.splitPaneClose)}
              split="vertical"
              defaultSize={splitPos} primary="second"
              onChange={ size => localStorage.setItem('splitPos', Math.floor(size)) }>
                {props.children}
            </SplitPane>
        </Wrapper>
    )
}
export default Splitter

