'use client'
import React, { useEffect } from 'react';


const UseCloseModal= (buttonRef: React.RefObject<HTMLButtonElement>, ref: React.RefObject<HTMLDivElement>, onClose : () => void) => {
  
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape' && buttonRef.current) {
            buttonRef.current.blur();
            onClose();
          }
        };

        const handleClickOutside = (event: MouseEvent) => {
          if (ref.current && !ref.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
            buttonRef.current.blur();
            onClose();
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [ref, onClose, buttonRef]);

};

export default UseCloseModal;