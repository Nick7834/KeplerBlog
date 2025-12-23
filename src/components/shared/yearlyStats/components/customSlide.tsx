import React from 'react';

interface Props {
    className?: string;
} 

export const CustomSlide: React.FC<Props> = ({ className }) => {
    return (
        <div className={className}>Component</div>
    );
};
