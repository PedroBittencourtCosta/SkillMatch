import { Box, VStack, HStack, Text, Badge, Image, IconButton, Link as ChakraLink } from '@chakra-ui/react';
import { HiExternalLink, HiTrash } from 'react-icons/hi';

export default function PortfolioItem({ item, onRemove, isEditable = false, isInternal = false }) {
  return (
    <Box
      bg="rgba(26, 32, 44, 0.5)"
      border="1px solid rgba(255, 255, 255, 0.06)"
      borderRadius="2xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 128, 230, 0.12)',
        borderColor: 'rgba(0, 198, 255, 0.2)',
      }}
    >
      {/* Imagem */}
      {item.imagem && (
        <Image
          src={item.imagem}
          alt={item.titulo}
          w="100%"
          h="180px"
          objectFit="cover"
          fallback={
            <Box
              w="100%"
              h="180px"
              bg="linear-gradient(135deg, rgba(0,128,230,0.2), rgba(0,198,255,0.1))"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="3xl">{isInternal ? '💼' : '🚀'}</Text>
            </Box>
          }
        />
      )}
      {!item.imagem && (
        <Box
          w="100%"
          h="180px"
          bg="linear-gradient(135deg, rgba(0,128,230,0.2), rgba(0,198,255,0.1))"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="3xl">{isInternal ? '💼' : '🚀'}</Text>
        </Box>
      )}

      <VStack align="stretch" spacing={3} p={5}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <Badge
              colorScheme={isInternal ? 'cyan' : 'purple'}
              borderRadius="full"
              px={2}
              fontSize="xs"
            >
              {isInternal ? 'SkillMatch' : 'Externo'}
            </Badge>
            <Text fontWeight="700" fontSize="md" color="white">
              {item.titulo}
            </Text>
          </VStack>
          <HStack>
            {item.link && (
              <IconButton
                as={ChakraLink}
                href={item.link}
                isExternal
                icon={<HiExternalLink />}
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'cyan.400' }}
                aria-label="Link externo"
              />
            )}
            {isEditable && onRemove && (
              <IconButton
                icon={<HiTrash />}
                variant="ghost"
                size="sm"
                color="gray.500"
                _hover={{ color: 'red.400' }}
                onClick={() => onRemove(item.id)}
                aria-label="Remover"
              />
            )}
          </HStack>
        </HStack>

        <Text fontSize="sm" color="gray.400" noOfLines={2}>
          {item.descricao}
        </Text>

        {/* Tecnologias */}
        <HStack spacing={1} flexWrap="wrap">
          {(item.tecnologias || []).map((tech) => (
            <Badge
              key={tech}
              bg="rgba(255,255,255,0.06)"
              color="gray.300"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
            >
              {tech}
            </Badge>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
