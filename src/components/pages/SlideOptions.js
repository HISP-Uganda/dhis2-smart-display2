import React from 'react';

import {ShareAltOutlined} from '@ant-design/icons';
import {
  Edit,
  Info,
  PlayCircleOutline,
  Schedule,
  GroupAdd
} from '@material-ui/icons';
import {observer} from 'mobx-react';
import {useMst} from '../../context/context';
import {Input, Button, Checkbox, InputNumber} from 'antd';
import { useForm } from "react-hook-form";

const plainOptions = ['slide', 'zoom', 'spin', 'fade'];

const {TextArea} = Input

export const SlideOptions = observer(() => {
  const {currentPresentation} = useMst();
  const { errors } = useForm();


  return (
    <div className="flex md:flex-row flex-wrap h-64 ml-6 py-2 px-4">
      <div className="flex flex-col w-full md:w-1/2 pr-6 mb-10">
        <div className="-ml-6  mb-2 pr-2 text-blue-500"><Edit className="text-gray-500"/>Presentation Name:</div>
        <Input name = "presentationName" size="large" required = "Required" value={currentPresentation.name} placeholder="Presentation name" className="w-full "
               onChange={currentPresentation.onNameChange} message = "invalid email address"
              
               />
               {errors.presentationName && errors.presentationName.message}
      </div>
      <div className="flex flex-col w-full md:w-1/2 pl-6 mb-10">
        <div className="-ml-6 mb-2 pr-2 text-blue-500"><Schedule className="text-gray-500"/>Slide duration
          (milliseconds):
        </div>
        <InputNumber onChange={currentPresentation.setSlideDuration} min={20000} max={60000}
                     value={currentPresentation.slideDuration} step={1000} size="large"
                     placeholder="input placeholder"/>
      </div>

      <div className="flex flex-col w-full md:w-1/2 pr-6 mb-10">
        <div className="-ml-6 mb-2 pr-2 text-blue-500"><Info className="text-gray-500"/>Description:</div>
        <TextArea value={currentPresentation.description} placeholder="Presentation description"
                  onChange={currentPresentation.onDescriptionChange} className="w-full pl-3" rows={3}/> 
      </div>
      <div className="flex flex-col w-full md:w-1/2 pl-6 mb-10 ">
        <div className="-ml-6  mb-2 pr-2 text-blue-500"><GroupAdd className="text-gray-500"/>Restrict Access to this
          presentation:
        </div>
        <Button className="bg-blue-500 text-white w-24" disabled icon={<ShareAltOutlined className="text-white"/>}>Share</Button>
        <p className="text-gray-500">Coming Soon</p>
      </div>

      <div className="flex flex-col w-full md:w-1/2 pr-6 mb-10">
        <div className="-ml-6  mb-2 pr-2 text-blue-500"><PlayCircleOutline className="text-gray-500"/>Transition mode:
        </div>
        <Checkbox.Group options={plainOptions} value={currentPresentation.transitionModes}
                        onChange={currentPresentation.setTransitionModes}/>
      </div>
      <div className="flex flex-col w-full md:w-1/2 pl-6 mb-10">
        <div className="-ml-6  mb-2 pr-2 text-blue-500"><Edit className="text-gray-500" />Schedule presentation (PDF)
          sharing:
        </div>
        <div className="flex w-full">

          <div className="w-1/2">
            <Button className="bg-blue-500 text-white" disabled icon={<GroupAdd className="text-white"/>}>Add
              Recipients</Button> <p className="text-gray-500">Coming Soon</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 pr-6 mb-10">
        <div className="-ml-6 mb-2 pr-2"><Edit/>Transition duration (seconds):</div>
        <InputNumber min={100} max={1000} value={currentPresentation.transitionDuration} size="large"
                     onChange={currentPresentation.setTransitionDuration} placeholder="input placeholder"/>
      </div>
    </div>
  );
});
