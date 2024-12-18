import React, { useEffect } from 'react';
import Trackify from '../lib/Trackify';
import EventTracker from '../lib/EventTracker';

const TrackifyProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    Trackify.getInstance(); // Инициализация библиотеки

    // Инициализация отслеживания событий
    EventTracker.trackClicks();
    EventTracker.trackMouseMovement();
    EventTracker.trackScroll();

    return () => {
      // Очистка при размонтировании
    };
  }, []);

  return <>{children}</>;
};

export default TrackifyProvider;
