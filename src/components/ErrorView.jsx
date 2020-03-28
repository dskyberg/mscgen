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
* ErrorView.jsx
*/
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider'


const useStyles = makeStyles(theme => ({
    error: {
        margin: theme.spacing(2),
        padding: theme.spacing(1)
    },
    header: {
      backgroundColor: theme.palette.error.main
    }
}));



function ErrorView(props) {
    const {error} = props
    const classes = useStyles()

    if (!Boolean(props.error)) {
        return null
    }
    const name = Boolean(error.name) ? error.name : 'No name'
    const message = Boolean(error.message) ? error.message : 'No message'
    const startLine = Boolean(error.location) ? error.location.start.line : 'Unknown'
    const startColumn = Boolean(error.location) ? error.location.start.column : 'Unknown'

    return (
        <Card id="error-view" className={ classes.error }>
          <CardHeader variant="h4" title="Parse Error" subheader={name} className={classes.header}/>
          <Divider />
          <CardContent>
            <Typography>Line: { startLine }, column: {startColumn} </Typography>
            <Typography>{ message }</Typography>
            <Divider/>
            <Typography>{ JSON.stringify(error) }</Typography>
          </CardContent>
        </Card>
    )
}
export default ErrorView
