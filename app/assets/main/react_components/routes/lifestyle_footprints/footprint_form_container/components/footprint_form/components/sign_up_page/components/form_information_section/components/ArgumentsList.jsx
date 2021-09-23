import React from 'react';
import { useTexts } from '../../../../../../../../contexts/TextsContext';

const ArgumentsList = () => {
  const {
    reactContentText: { arguments_list },
  } = useTexts();

  const middleArgumentIndex = (Object.values(arguments_list).length - 1) / 2;

  return (
    <div className="flex flex-col mx-0 md:flex-row lg:flex-row justify-center">
      {Object.values(arguments_list).map((argument, index) => (
        <div
          className={
            'flex flex-col w-1/3 ' + (index == middleArgumentIndex && 'mx-2')
          }
          key={argument.title}
        >
          <div className={'fas fa-5x fa-' + argument.icon}></div>
          <h2 className="heading text-base my-4">{argument.title}</h2>
          <div className="text-sm">{argument.text}</div>
        </div>
      ))}
    </div>
  );
};

export default ArgumentsList;
