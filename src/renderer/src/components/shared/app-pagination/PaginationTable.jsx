import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ChakraProvider,
  HStack,
  IconButton,
  Select,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import React from "react";

const ButtonPagination = ({ children, index, setPageIndex, pageIndex, colorScheme = "teal" }) => {
  return (
    <Button
      size="sm"
      onClick={() => setPageIndex(index)}
      colorScheme={colorScheme}
      variant={pageIndex === index ? "solid" : "link"}
    >
      {children}
    </Button>
  );
};

export const PaginationTable = (props) => {
  const {
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    totalItemsCount,
    pageSizeOptions = [10, 25, 50],
    showOptions = true,
    labelOptions = "Items mostrados",
    colorScheme = "teal",
    showQuantity = false,
  } = props;

  const showButtons = () => {
    let buttons = [];
    const TOTAL_INDEX = Math.ceil(totalItemsCount / pageSize);

    if (TOTAL_INDEX <= 5) {
      for (let index = 0; index < TOTAL_INDEX; index++) {
        buttons.push(
          <ButtonPagination
            key={index}
            colorScheme={colorScheme}
            setPageIndex={setPageIndex}
            index={index}
            pageIndex={pageIndex}
          >
            {index + 1}
          </ButtonPagination>
        );
      }
    } else {
      let start = Math.max(0, pageIndex - 2);
      let end = Math.min(TOTAL_INDEX - 1, start + 4);

      if (end === TOTAL_INDEX - 1) {
        start = Math.max(0, end - 4);
      }

      for (let index = start; index <= end; index++) {
        buttons.push(
          <ButtonPagination
            key={index}
            colorScheme={colorScheme}
            setPageIndex={setPageIndex}
            index={index}
            pageIndex={pageIndex}
          >
            {index + 1}
          </ButtonPagination>
        );
      }
    }

    buttons.unshift(
      <IconButton
        key="prev"
        icon={<ArrowLeftIcon />}
        size="sm"
        onClick={() => setPageIndex(pageIndex - 1)}
        isDisabled={!(pageIndex > 0)}
        colorScheme={colorScheme}
        variant="link"
        aria-label="Previous"
      />
    );

    buttons.push(
      <IconButton
        key="next"
        icon={<ArrowRightIcon />}
        size="sm"
        onClick={() => setPageIndex(pageIndex + 1)}
        isDisabled={!(pageIndex + 1 < TOTAL_INDEX)}
        colorScheme={colorScheme}
        variant="link"
        aria-label="Next"
      />
    );

    return buttons;
  };

  return (
    // <ChakraProvider>
      <Flex w="100%" align="center" p={2}>
        {showOptions && (
          <HStack spacing={10}>
            <Text fontSize="sm">{labelOptions}:</Text>
            <Select
              w="auto"
              size="sm"
              variant="unstyled"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            {showQuantity && <Text fontSize="sm">Total: {totalItemsCount}</Text>}
          </HStack>
        )}

        <Spacer />

        <HStack spacing={2}>{showButtons()}</HStack>
      </Flex>
    // </ChakraProvider> 
  );
};


export default PaginationTable;

// ------ CHANGELOG ------
// ✅ Support both named and default export