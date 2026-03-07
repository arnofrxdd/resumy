import { createContext, useContext } from 'react';

export const SectionContext = createContext({
    isContinued: false,
    sectionId: '',
    zoneId: 'main'
});

export const useSectionContext = () => useContext(SectionContext);
