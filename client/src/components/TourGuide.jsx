import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const TourGuide = ({ userId, start, onTourEnd }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (start) {
      setRun(true);
    } else if (userId) {
      const tourSeen = localStorage.getItem(`tour_seen_challenges_${userId}`);
      if (!tourSeen) {
        setRun(true);
      }
    }
  }, [userId, start]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      if (onTourEnd) onTourEnd();
      if (userId) {
        localStorage.setItem(`tour_seen_challenges_${userId}`, 'true');
      }
    }
  };

  const steps = [
    {
      target: 'body',
      content: 'Welcome to the Challenges Arena! Here you can find all competitions.',
      placement: 'center',
    },
    {
      target: '.challenges-header',
      content: 'This is your hub for pushing limits and earning rewards.',
    },
    {
      target: '.create-challenge-btn',
      content: 'Want to start your own competition? Click here to create a new challenge.',
    },
    {
      target: '.stats-container',
      content: 'Quickly see active, upcoming, and completed challenges. Click on these cards to filter the list!',
    },
    {
      target: '.challenges-grid',
      content: 'Browse through the list of challenges and join the ones that interest you.',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: '#000',
          zIndex: 10000,
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default TourGuide;
