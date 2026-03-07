
import { createContext, useContext } from 'react';

export const ResumeContext = createContext({
    highlightSection: null, // ID of section to highlight
    onSectionClick: () => { }, // Handle clicks
    isReorderMode: false,
    setIsReorderMode: () => { },
    isMobile: false,
});

export const useResumeContext = () => useContext(ResumeContext);
