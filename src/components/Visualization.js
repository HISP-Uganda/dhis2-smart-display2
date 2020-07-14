import { useConfig } from '@dhis2/app-runtime';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
//import { DoubleLeftOutlined } from '@ant-design/icons';
import Fab from "@material-ui/core/Fab";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import HomeIcon from "@material-ui/icons/Home";

export const Visualization = observer(({ item, height, width, showFooter = false, isFullscreen = false, setIsFullscreen, style = {} }) => {
  const handleExitFullscreen = () => {
    document.exitFullscreen();
  }
  const { baseUrl } = useConfig();
  useEffect(() => {
    item.load({ baseUrl });
  });
  return (<div className="flex flex-col">
    <div id={item.getItemId} style={{ ...style, width: width, height: showFooter ? height - 60 : height }} />
    {showFooter ? <div style={{ height: 60 }} className="flex items-center">
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
      <div className="pr-2 text-right">
        <Fab size="medium" color="primary">
          <HomeIcon onClick={() => store.setPage('3')} />
        </Fab>
      </div>
    </div> : null}
  </div>
  )
});