import React, { useState } from 'react';

const ReadMore = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  const displayedText = isExpanded ? text : text.slice(0, maxLength) + "....";
  const buttonText = isExpanded ? " Read Less" : "Read More";

  return (
    <div >
      <p className='text-sm'>{displayedText}
      <button className='text-xs font-semibold' onClick={toggleReadMore}>{buttonText}</button></p>
    </div>
  );
};

export default ReadMore;