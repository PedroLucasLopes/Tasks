import {
  Box,
  Card as ChakraCard,
  HStack,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SkeletonText } from "../../../components/ui/skeleton";
import { Dispatch, SetStateAction } from "react";
import useParseDate from "../../../hook/useParseDate";

interface IProps extends ITasks {
  loading: boolean;
  width?: string;
  setId?: Dispatch<SetStateAction<number>>;
  getTaskById?: (id: number) => void;
}

const Card: React.FC<IProps> = ({
  id,
  name,
  description,
  subtasks,
  is_done,
  created_at,
  loading,
  setId,
  getTaskById,
}) => {
  const parseDate = useParseDate();
  const formatedDate = parseDate(created_at!);

  return loading ? (
    <Stack gap="6" w="15rem" h="15rem">
      <VStack width="full">
        <SkeletonText noOfLines={1} mb="2rem" />
        <SkeletonText noOfLines={3} />
        <SkeletonText noOfLines={1} mt="2rem" />
      </VStack>
    </Stack>
  ) : (
    <ChakraCard.Root
      w="15rem"
      h="15rem"
      cursor="pointer"
      onClick={() => {
        if (setId && getTaskById) {
          setId(id!);
          getTaskById(id!);
        }
      }}
      boxShadow="1px 2px 10px #dbdbdb"
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.2s ease",
        border: "2px solid black",
      }}
    >
      <ChakraCard.Header textAlign="left" mb="-1.4rem">
        <HStack>
          <Text
            fontSize="1.3rem"
            fontWeight="bold"
            textDecoration={is_done ? "line-through" : "none"}
          >
            {name}
          </Text>
        </HStack>
        <Separator />
      </ChakraCard.Header>
      <ChakraCard.Body mb="1.5rem">
        <VStack
          alignItems="start"
          textDecoration={is_done ? "line-through" : "none"}
        >
          {description}
          {subtasks && subtasks.length > 0 && (
            <VStack
              alignItems="start"
              position="relative"
              maxHeight="200px"
              overflow="hidden"
            >
              <Text
                fontWeight="bold"
                mb="-.5rem"
                textDecoration={is_done ? "line-through" : "none"}
              >
                Subtasks
              </Text>
              <VStack alignItems="start" overflow="hidden" mb="-2rem">
                {subtasks.slice(0, 3).map((subtask, i) => (
                  <Text
                    key={i}
                    textDecoration={is_done ? "line-through" : "none"}
                  >
                    {subtask.name}
                  </Text>
                ))}
                {subtasks.length > 2 && (
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    background="linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))"
                    height="30%"
                  ></Box>
                )}
              </VStack>
            </VStack>
          )}
        </VStack>
      </ChakraCard.Body>
      <ChakraCard.Footer mt="-2rem">
        Criado em: {formatedDate}
      </ChakraCard.Footer>
    </ChakraCard.Root>
  );
};

export default Card;
