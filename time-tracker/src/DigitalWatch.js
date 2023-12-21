import React, { useState, useEffect } from 'react';

const DigitalWatch = ({ threshold, onThresholdCrossed }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isThresholdCrossed, setIsThresholdCrossed] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => {
        const newElapsedTime = prevElapsedTime + 1;

        if (!isThresholdCrossed && newElapsedTime >= threshold) {
          setIsThresholdCrossed(true);
          onThresholdCrossed && onThresholdCrossed();
        }

        return newElapsedTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isThresholdCrossed, threshold, onThresholdCrossed]);

  const formattedTime = formatTime(elapsedTime);

  return (
    <div style={{ ...styles.watch, border: isThresholdCrossed ? '2px solid red' : '2px solid #fff' }}>
      <div style={styles.display}>{formattedTime}</div>
    </div>
  );
};

const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const styles = {
  watch: {
    width: '120px',
    height: '60px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1em',
    fontFamily: 'monospace',
    backgroundColor: '#333',
    color: '#4CAF50', // Green text color
  },
  display: {},
};

export default DigitalWatch;
