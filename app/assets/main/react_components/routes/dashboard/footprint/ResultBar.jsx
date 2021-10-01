import React from 'react';

/**
 * Shows co2e footprint result using a colored bar, title (with an optional icon) and value tag
 */
const ResultBar = ({
  title,
  width,
  value,
  color = 'bg-primary',
  fontWeight = '',
  spaceStyling = '',
  spanWidth = '',
}) => {
  return (
    <div className={spaceStyling}>
      <div className="text-left">
        {title.icon && (
          <i className={'fas fa-fw fa-lg ' + title.icon} aria-hidden="true"></i>
        )}
        <span className={fontWeight}>{title.text}</span>
      </div>
      <div className="flex-1 pr-24">
        <div
          className={
            'relative h-5 m-lg:h-6 ' + (width > 0 ? 'box-content pr-2' : '')
          }
          style={{ width: width + '%' }}
        >
          {width > 0 && (
            <div className={'w-full h-full rounded-r ' + color}></div>
          )}
          <span
            className={
              'text-left absolute left-100 top-1/2 transform -translate-y-1/2 leading-none font-bold ' +
              spanWidth
            }
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultBar;
