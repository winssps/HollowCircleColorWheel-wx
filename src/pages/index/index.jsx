import { Component, useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
import HollowCircle from "../../components/HollowCircle"
import './index.less'

export default () => {
  const [hsva, setHsva] = useState({
    h: 214.1176470588235,
    s: 100,
    v: 100,
    a: 1,
  });
  const [color, setColor] = useState(hsvaToHex(hsva));
  return (
    <div className='index' style={{backgroundColor: color, height: "100vh"}}>
      <HollowCircle color={hsva}
        onChange={(color) => {
          setHsva({ ...hsva, ...color.hsva });
          setColor(color.hex);
        }} />
    </div>
  )

}
