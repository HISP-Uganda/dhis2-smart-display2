import React from 'react';
import { Visualization } from '../Visualization';
import { DHIS2Visualization } from '../DHIS2Visualization';
import {
  VISUALIZATION,
  CHART,
  REPORT_TABLE,
  TEXT
} from '../../modules/ItemTypes'

export const VisualizationItem = ({ item, height, width, showFooter = false, setIsFullscreen, isFullscreen }) => {
  const activeType = item.type;
  switch (activeType) {
    case VISUALIZATION:
    case CHART:
    case REPORT_TABLE:
      return <DHIS2Visualization width={width} height={height} item={item.dashboardItemContent} showFooter={showFooter} setIsFullscreen={setIsFullscreen} isFullscreen={isFullscreen} />
    //case TEXT:
    //  return <div>{JSON.stringify(item, null, 2)}</div>
    default:
      return <Visualization width={width} height={height} item={item.dashboardItemContent} showFooter={showFooter} setIsFullscreen={setIsFullscreen} isFullscreen={isFullscreen} />
  }
};
