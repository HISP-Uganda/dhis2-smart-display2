import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { Deck, Slide } from 'spectacle';
import createTheme from 'spectacle/lib/themes/default';
import useFullscreenStatus, { useMst } from '../context/context';
import { VisualizationItem } from "./pages/VisualizationItem";

const theme = createTheme(
  {
    primary: 'none',
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
  let isFullscreen, setIsFullscreen;
  const [height, setHeight] = useState(window.outerHeight)
  try {
    [isFullscreen, setIsFullscreen] = useFullscreenStatus(maximizableElement);
  } catch (e) {
    isFullscreen = false;
    setIsFullscreen = undefined;
  }

  useEffect(() => {
    if (isFullscreen) {
      setHeight(window.outerHeight)
    } else {
      setHeight(window.innerHeight - 100)
    }
  }, [isFullscreen, height])

  if (store.currentPresentation.selectedItems.length === 0) {
    return <div> No slides found</div>
  }


  return (<div ref={maximizableElement} className="slide-show">
    <Deck
      transition={store.currentPresentation.transitionModes}
      transitionDuration={store.currentPresentation.transitionDuration}
      autoplay={true}
      autoplayDuration={store.currentPresentation.slideDuration}
      showFullscreenControl={false}
      controls={true}
      progress="none"
      theme={theme}
      contentHeight={`${height}px`}
      contentWidth="100%"
      autoplayLoop={true}
      autoplayOnStart={true}
      textColor={theme.textColor}
    >
      {store.currentPresentation.selectedItems.map(item =>
        <Slide
          key={item.id}
          fit={true}
          controlColor={slideTheme.controlColor}
          bgColor={isFullscreen ? 'white' : 'transparent'}
          contentStyles={{
            // display: 'flex',
            // alignContent: 'center',
            // justifyContent: 'center',
            // alignItems: 'center',
            padding: 0,
            margin: 0,
            // width: window.outerWidth,
            // height,
            // marginTop: 100,
            overflow: 'auto'
          }}
          align="center center"
        // className="m-0 p-0"
        // margin={0}
        // padding={0}
        >
          <VisualizationItem item={item} height={height} width={window.outerWidth} showFooter={true} setIsFullscreen={setIsFullscreen} isFullscreen={isFullscreen} />
        </Slide>)}
    </Deck>
  </div>)
})
