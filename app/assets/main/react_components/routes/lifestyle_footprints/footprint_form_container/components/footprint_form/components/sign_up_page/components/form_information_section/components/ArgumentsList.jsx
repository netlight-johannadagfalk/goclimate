import React from 'react';
import { useTexts } from '../../../../../../../../contexts/TextsContext';

const ArgumentsList = () => {
  const {
    reactContentText: {
      sign_up_page: {
        membership_page: { arguments_list },
      },
    },
  } = useTexts();

  return (
    <div className="flex flex-col mx-0 t:flex-row justify-center my-14 px-2">
      {Object.values(arguments_list).map((argument, index) => (
        <div
          className={
            'flex flex-row t:flex-col w-full t:w-1/3 items-center justify-around t:justify-start mx-0 t:my-0' +
            (index == 1 && ' t:mx-2 my-4')
          }
          key={argument.title}
        >
          <div className="w-1/6 t:w-full text-center pl-1/5 t:pl-0">
            <div
              className={
                'fas m-xs:text-3xl t:text-5xl text-2xl fa-' + argument.icon
              }
            ></div>
          </div>
          <div className="w-5/6 t:w-full px-2">
            <h2 className="heading text-base my-4 hidden t:block">
              {argument.title}
            </h2>
            <div className="text-sm text-left t:text-center">
              {argument.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArgumentsList;
