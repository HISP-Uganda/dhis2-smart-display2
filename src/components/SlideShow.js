import React, {useCallback, useState, useEffect} from 'react';
import {observer} from 'mobx-react';
import useFullscreenStatus, {useMst, useWindowDimensions} from '../context/context';
import createTheme from 'spectacle/lib/themes/default';
import {Deck, Slide, Text} from 'spectacle';
import {VisualizationItem} from "./pages/VisualizationItem";
import Fab from "@material-ui/core/Fab";
import HomeIcon from "@material-ui/icons/Home";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";

const theme = createTheme(
  {
    primary: 'white',
    secondary: '#000000',
    textColor: '#327dcc',
  },
  {
    primary: 'Helvetica'
  },
);
const slideTheme = {
  controlColor: '#477fcc'
};

export const SlideShow = observer(() => {
  const store = useMst();
  const maximizableElement = React.useRef(null);
  const {height, width} = useWindowDimensions();
  let isFullscreen, setIsFullscreen;
  let errorMessage;
  try {
    [isFullscreen, setIsFullscreen] = useFullscreenStatus(maximizableElement);
  } catch (e) {
    isFullscreen = false;
    setIsFullscreen = undefined;
  }

  const handleExitFullscreen = () => document.exitFullscreen();

  return store.currentPresentation.selectedItems.length > 0 ?
    <Deck
      transition={store.currentPresentation.transitionModes}
      transitionDuration={store.currentPresentation.transitionDuration}
      autoplay={true}
      autoplayDuration={store.currentPresentation.slideDuration}
      showFullscreenControl={false}
      controls={true}
      progress="none"
      theme={theme}
      contentHeight="98vh"
      contentWidth="98vw"
      autoplayLoop={true}
      autoplayOnStart={true}
      textColor={theme.textColor}
    >
      {store.currentPresentation.selectedItems.map(item =>
        <Slide
          key={item.id}
          fit={true}
          controlColor={slideTheme.controlColor}
          contentStyles={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
          margin={0}
          padding={0}
        >
          <VisualizationItem item={item} height={'70vh'} width={'70vw'}/>
        </Slide>
      )}
    </Deck> : <div>
      No slides found
    </div>

})

