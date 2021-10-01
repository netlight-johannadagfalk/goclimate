import React, { useState, useEffect } from 'react';
import CarouselCard from './CarouselCard.jsx';
import { useClimateActions } from '../../../contexts/ClimateActionsContext.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import { orderBy } from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { m, t, d, dMd, dLg } from '../../../constants';

// Swiper resources
//https://swiperjs.com/react
//https://swiperjs.com/swiper-api#parameters

import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper/core';
SwiperCore.use([Pagination, Navigation, Scrollbar]);

const CarouselList = ({ user, updateLocalAccepted, categories }) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
  const climateActions = useClimateActions();
  const isMobile = useMediaQuery({ query: `(max-width: ${m})` });
  const isTablet = useMediaQuery({ query: `(max-width: ${t})` });
  const isSmallDesktop = useMediaQuery({ query: `(max-width: ${d})` });
  const isMediumDesktop = useMediaQuery({ query: `(max-width: ${dMd})` });
  const isLargeDesktop = useMediaQuery({ query: `(max-width: ${dLg})` });

  const sortForMobileClimateActions = orderBy(
    climateActions,
    ['action_of_the_month'],
    ['desc']
  );

  const actions =
    isMobile || isSmallDesktop ? sortForMobileClimateActions : climateActions;

  const noOfItemsShown = isMobile
    ? 1.25
    : isTablet
    ? 2.25
    : isSmallDesktop
    ? 2
    : isMediumDesktop
    ? 2.5
    : isLargeDesktop
    ? 3
    : 4;

  const [loopActions, setLoopActions] = useState(
    actions.length > noOfItemsShown ? true : false
  );
  const hideArrows = isMobile || !loopActions ? true : false;

  useEffect(() => {
    actions.length > noOfItemsShown
      ? setLoopActions(true)
      : setLoopActions(false);
  }, [climateActions]);

  return (
    <div className="relative overflow-visible">
      <Swiper
        loop={loopActions}
        slidesPerView={noOfItemsShown}
        navigation={{
          prevEl: '.prevButton',
          nextEl: '.nextButton'
        }}
        pagination={true}
        preventClicks={false}
        preventClicksPropagation={false}
        noSwiping={true}
        noSwipingSelector={'button'}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
      >
        {actions.map((action) => (
          <SwiperSlide
            key={action.id}
            className={'min-h-full mb-10'}
            style={{
              height: 'auto'
            }}
          >
            <CarouselCard
              action={action}
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              categories={categories}
            ></CarouselCard>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`flex flex-row absolute z-10 top-1/2 w-full ${
          hideArrows ? 'invisible' : ''
        }
        `}
      >
        <div className="relative w-full">
          <button
            ref={navigationPrevRef}
            disabled={!loopActions}
            className={
              'rounded-full -left-6 h-12 w-12 bg-white border border-gray-accent fas fa-chevron-left absolute focus:outline-none prevButton'
            }
          />
          <button
            ref={navigationNextRef}
            disabled={!loopActions}
            className={
              'rounded-full -right-6 h-12 w-12 bg-white border border-gray-accent fas fa-chevron-right absolute focus:outline-none nextButton'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselList;
