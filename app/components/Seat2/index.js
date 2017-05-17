/**
* Created by jzobro 20170517
*/
import React from 'react';
import Button from '../../components/Button';

const SeatComponent = () => {
  const handleClick = () => {
    console.log('word to your muffler');
  };
  return (
    <div>
      Word to your muffler.
      <Button onClick={() => handleClick()} size="small">
        Press Me
      </Button>
    </div>
  );
};

export default SeatComponent;
