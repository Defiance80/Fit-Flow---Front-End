import React from 'react';

const RichTextContent = ({ content }: { content: string }) => {
  return (
    <div 
      className="rich-text-content" 
      dangerouslySetInnerHTML={{ __html: content || "" }} 
    />
  );
};

export default RichTextContent;