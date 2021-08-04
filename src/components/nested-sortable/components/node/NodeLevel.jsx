import React from 'react';
import PropTypes from 'prop-types';

export default function NodeLevel({ level, offset, step }) {
  const indent = offset + level * step;
  const style = {
    marginLeft: `${indent}px`,
  };
  return <div style={style}></div>;
}

NodeLevel.propTypes = {
  level: PropTypes.number,
  offset: PropTypes.number,
  step: PropTypes.number,
};
