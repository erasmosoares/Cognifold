// React and hooks
import { useState, useEffect } from 'react';

// Chakra
import { useColorMode } from '@chakra-ui/react';


export const useContentRenderer = () => {
  // Selectors
  const [selectedTabAnalysis, setSelectedTabAnalysis] = useState(0);
  const [selectedTabEntertainment, setSelectedTabEntertainment] = useState(0);
  const [selectedTabConversational, setSelectedTabConversational] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Data
  //const [financialAnalysis, setFinancialAnalysis] = useState<FinancialAnalysis[]>([]);

  // Color Mode
  const { colorMode } = useColorMode();
  const colorTheme: 'light' | 'dark' = colorMode === 'dark' ? 'dark' : 'light';

  // Effects
  useEffect(() => {
    const isFirstTime = localStorage.getItem('isFirstTime') === null;
    if (isFirstTime) {
      setShowWelcomeModal(true);
      localStorage.setItem('isFirstTime', 'false');
    }
  }, []);


  const handleCloseModal = () => setShowWelcomeModal(false);

  return {
    // selectors
    selectedTabAnalysis,
    setSelectedTabAnalysis,
    selectedTabEntertainment,
    setSelectedTabEntertainment,
    selectedTabConversational,
    setSelectedTabConversational,
    showWelcomeModal,
    setShowWelcomeModal,



    // theme
    colorTheme,

    // handlers
    handleCloseModal,
  };
};

export type UseContentRendererReturn = ReturnType<typeof useContentRenderer>;
