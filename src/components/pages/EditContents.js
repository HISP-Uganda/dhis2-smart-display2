import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {observer} from 'mobx-react';
import {useMst, useWindowDimensions} from '../../context/context';
import {VisualizationItem} from './VisualizationItem'


export const EditContents = observer(() => {
  const store = useMst();
  const {currentPresentation} = store;
  const {height} = useWindowDimensions();

  return (
    <div className="h-auto px-4 -mb-16">
      <div className="flex md:flex-row flex-wrap">
        <div className="w-full md:w-1/4 bg-gray overflow-auto" style={{height: height - 260}}>
          {currentPresentation.selectedItems.map(item => <div key={item.id} className="p-2 bg-gray-100">
            <Card>
              <CardContent>
                <VisualizationItem height='20em' item={item}/>
              </CardContent>
              <CardActions>
              </CardActions>
            </Card>
          </div>)}
        </div>
        <div className="w-full md:w-3/4 bg-red pl-4">
          <div>
            <Card className="h-88">
              <CardContent>
                <p></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});
