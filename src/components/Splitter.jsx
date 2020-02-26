import React from 'react';
import styled from "styled-components";
import SplitPane from 'react-split-pane'

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

const Splitter = (props) => {

    return (
        <Wrapper >
            <SplitPane style={{marginLeft:72}} split="vertical" defaultSize="500" primary="second">
                {props.children}
            </SplitPane>
        </Wrapper>
    )
}
export default Splitter

