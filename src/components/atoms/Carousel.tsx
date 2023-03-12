'use client'
import React from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';

interface Props {
  speed?: number;
  enableAutoPlay?: boolean;
  enableMouseSwipe?: boolean;
  currentIndex?: number;
  children: JSX.Element[] | JSX.Element;
}

const Carousel = ({
//   speed = 5000,
//   enableAutoPlay = true,
  enableMouseSwipe = true,
  currentIndex = 0,
  children,
}: Props) => {
  return (
    <SwipeableViews  enableMouseEvents={enableMouseSwipe} index={currentIndex} >
      {children}
    </SwipeableViews>
  );
};

export default Carousel;