import { HStack, Text } from '@chakra-ui/react';
import { HiUsers, HiUser } from 'react-icons/hi';

export default function TeamBadge({ vagas }) {
  const isTeam = vagas > 1;

  return (
    <HStack
      spacing={1}
      bg={isTeam ? 'rgba(159, 122, 234, 0.15)' : 'rgba(72, 187, 120, 0.15)'}
      color={isTeam ? 'purple.300' : 'green.300'}
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
    >
      {isTeam ? <HiUsers size={12} /> : <HiUser size={12} />}
      <Text>{isTeam ? `Time (${vagas})` : 'Individual'}</Text>
    </HStack>
  );
}
