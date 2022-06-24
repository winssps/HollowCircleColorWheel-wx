import React from 'react';
import './Point.css';

export default (props) => {
  const { style } = props;
  return (
    <div
      style={{
        ...style,
        position: 'absolute',
        left: 0,
        top: 0,
      }}
      class="point"
    >
      <div class="point-block"></div>
    </div>
  );
};
