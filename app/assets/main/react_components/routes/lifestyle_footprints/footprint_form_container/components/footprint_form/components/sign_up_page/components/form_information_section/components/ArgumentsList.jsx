import React from 'react';
import { useTexts } from '../../../../../../../../contexts/TextsContext';

const ArgumentsList = () => {
  const {
    reactContentText: {
      sign_up_page: {
        membership_page: { arguments_list }
      }
    }
  } = useTexts();

  return (
    <div className="flex flex-col mx-0 t:flex-row justify-center px-2 space-y-4 t:space-y-0">
      {Object.values(arguments_list).map((argument) => (
        <div
          className={
            'flex flex-row t:flex-col w-full t:w-1/3 items-center justify-around t:justify-start mx-0'
          }
          key={argument.title}
        >
          <div className="w-1/6 t:w-full text-center pl-1/5 t:pl-0">
            <div
              className={
                'fas text-2xl m-xs:text-3xl t:text-5xl fa-' + argument.icon
              }
            ></div>
          </div>
          <div className="w-5/6 t:w-full h-full px-2 space-y-4 t:space-y-0">
            <div className="h-1/3 w-full flex flex-wrap content-center text-center">
              <h2 className="heading text-base w-full t:pt-2 hidden t:block">
                {argument.title}
              </h2>
            </div>
            <div className="text-sm text-left t:text-center pt-0 t:pt-2">
              {argument.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArgumentsList;
