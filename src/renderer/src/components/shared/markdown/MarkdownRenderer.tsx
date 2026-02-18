import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const borderColor = useColorModeValue("#E2E8F0", "#222632");
  const textColor = useColorModeValue("#1A202C", "#E5E7EB");
  const codeBg = useColorModeValue("#F7FAFC", "#1E2026");

  return (
    <Box
      sx={{
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1rem",
        },
        "& th, & td": {
          border: `1px solid ${borderColor}`,
          padding: "8px 12px",
          textAlign: "left",
        },
        "& th": {
          backgroundColor: useColorModeValue("#F0F0F0", "#1A1D24"),
          fontWeight: "bold",
        },
        "& pre": {
          backgroundColor: codeBg,
          padding: "0.75rem",
          borderRadius: "6px",
          overflowX: "auto",
        },
        "& code": {
          backgroundColor: codeBg,
          color: textColor,
          padding: "0.2em 0.4em",
          borderRadius: "4px",
          fontSize: "0.9em",
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <Heading size="md" mt={6} mb={2} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <Heading size="sm" mt={5} mb={2} {...props} />
          ),
          p: ({ node, ...props }) => (
            <Text mb={3} lineHeight="1.6" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <Box as="ul" pl={5} mb={3} {...props} />
          ),
          li: ({ node, ...props }) => <Box as="li" mb={1} {...props} />,
          table: ({ node, ...props }) => <Table size="sm" {...props} />,
          thead: ({ node, ...props }) => <Thead {...props} />,
          tbody: ({ node, ...props }) => <Tbody {...props} />,
          tr: ({ node, ...props }) => <Tr {...props} />,
          th: ({ node, ...props }) => <Th {...props} />,
          td: ({ node, ...props }) => <Td {...props} />,
          code: ({ className, children, ...props }) => (
            <Box
              as="code"
              className={className}
              bg={codeBg}
              color={textColor}
              px="1"
              py="0.5"
              borderRadius="4"
              {...props}
            >
              {children}
            </Box>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;