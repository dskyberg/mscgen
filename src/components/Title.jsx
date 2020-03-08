/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title(props) {
  const {children, ...rest} = props
  return (
    <Typography component="h1" variant="h6" color="inherit" noWrap {...rest}>
   {children}
  </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};