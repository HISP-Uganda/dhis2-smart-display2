import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useConfig} from '@dhis2/app-runtime';
//import { DoubleLeftOutlined } from '@ant-design/icons';

export const Visualization = observer(({item, height, width, style = {}}) => {
  const {baseUrl} = useConfig();
  const [interpretation, setInterpretation] =  useState(false);
  // const [calculatedWidth, setCalculatedWidth] = useState(width);
  const [interpretationWidth, setInterpretationWidth] = useState (100);
  const changeInterepretation = () =>{
    setInterpretation (!interpretation);

    if (interpretation){
      setCalculatedWidth(width-300)
      setInterpretationWidth(300)
    }
    else{
      setCalculatedWidth(width)
      setInterpretationWidth(10)
    }
  }

  useEffect(() => {
    item.load({baseUrl});
  });
  return (
      <div id={item.getItemId} style={{...style, width:width, height:height}}/>
    )
});