import React, { useEffect, useState } from 'react';
import { useMst } from '../context/context';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import VisualizationPlugin from '@dhis2/data-visualizer-plugin';
import Fab from "@material-ui/core/Fab";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import HomeIcon from "@material-ui/icons/Home";

export const DHIS2Visualization = observer(({ item, height, width, showFooter = false, isFullscreen = false, setIsFullscreen, style = {} }) => {
  const [visualization, setVisualization] = useState({})
  const store = useMst();
  const handleExitFullscreen = () => {
    document.exitFullscreen();
  };

  useEffect(() => {
    store.currentPresentation.fetchItem(item).then(i => {
      if (item.type === 'REPORT_TABLE') {
        const { id, ...others } = i;
        setVisualization({ ...others, type: 'PIVOT_TABLE' });
      } else {
        setVisualization(i);
      }

    });
  }, [store]);
  return (<div className="flex flex-col" style={{ height, width }}>
    <div style={{ height: showFooter ? height - 60 : height }}>
      {isEmpty(visualization) ? <div>Loading</div> : <VisualizationPlugin
        d2={store.d2}
        visualization={visualization}
        forDashboard={true}
        style={{ ...style, width, height: showFooter ? height - 60 : height, display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}
      />}
    </div>
    {showFooter ? <div style={{ height: 60 }} className="flex items-center bg-gray-300">
      <div className="pl-2 text-left">
        {isFullscreen ? (
          <Fab
            size="medium"
            color="primary"
            onClick={handleExitFullscreen}
          >
            <FullscreenExitIcon />
          </Fab>
        ) : (
            <Fab
              size="medium"
              color="primary"
              onClick={setIsFullscreen}
            >
              <FullScreenIcon />
            </Fab>
          )}
      </div>
      <div className="text-5xl flex-1 pb-2 flex justify-center items-center content-center">{item.name}</div>
      <div className="pr-2 text-right"><Fab size="medium" color="primary">
        <HomeIcon onClick={() => store.setPage('3')} />
      </Fab></div>
    </div> : null}
  </div>)
});
