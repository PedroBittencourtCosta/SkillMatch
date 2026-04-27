import { Box, Flex, HStack, Text, Link as ChakraLink } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="rgba(10, 14, 26, 0.9)"
      borderTop="1px solid rgba(255,255,255,0.04)"
      py={8}
      px={{ base: 4, md: 8 }}
      mt="auto"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        gap={4}
      >
        <HStack spacing={2}>
          <Text
            fontWeight="800"
            bgGradient="linear(to-r, #00c6ff, #0080e6)"
            bgClip="text"
          >
            SkillMatch
          </Text>
          <Text fontSize="sm" color="gray.500">
            © 2026
          </Text>
        </HStack>

        <Text fontSize="xs" color="gray.600">
          Protótipo acadêmico — Empreendedorismo com Software
        </Text>
      </Flex>
    </Box>
  );
}
