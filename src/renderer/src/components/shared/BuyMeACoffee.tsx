import { Box } from '@chakra-ui/react';

const BuyMeACoffee = () => {
  const handleClick = () => {
    const url = 'https://www.buymeacoffee.com/erasmosoares';
    window.open(url, '_blank');
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">        
        <button onClick={handleClick}>
      <img
        src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=erasmosoares&button_colour=319795&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"
        alt="Buy me a coffee"
      />
    </button>
    </Box>
  );
};

export default BuyMeACoffee;
