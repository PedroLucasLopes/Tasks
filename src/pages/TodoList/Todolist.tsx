import {
  Input,
  VStack,
  Text,
  Button,
  Box,
  BoxProps,
  Separator,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  ForwardRefExoticComponent,
  useCallback,
  useState,
} from "react";
import { motion, MotionProps } from "framer-motion";
import CardGrid from "./Components/CardGrid";
import instance from "../../api/instance";

const MotionBox = motion.create(
  Box as ForwardRefExoticComponent<unknown>
) as React.FC<BoxProps & MotionProps>;

const Todolist = () => {
  const [taskFocus, setTaskFocus] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<ITasks>({} as ITasks);
  const [createTaskUpdate, setCreateTaskUpdate] = useState<boolean>(false);

  const onFocusTaskContainer = useCallback(() => {
    setTaskFocus(true);
  }, []);

  const createTask = useCallback(async () => {
    try {
      await instance.post("/api/tasks", newTask);
      setCreateTaskUpdate(true);
      setTaskFocus(false);
    } catch (err) {
      console.error("Erro ao criar task:", err);
      setTaskFocus(false);
    }
  }, [newTask]);

  return (
    <VStack w="100%" justify="center" alignItems="center" h="full" p="2rem">
      <VStack>
        <VStack w="20rem">
          <Text fontWeight="semibold" fontSize="1.3rem">
            Adicionar Task
          </Text>
          <VStack
            w="30rem"
            h="auto"
            p="1rem"
            border="1px solid black"
            borderRadius="5px"
            transition="all 0.3s ease-in-out"
            onFocus={onFocusTaskContainer}
          >
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: taskFocus ? 1 : 0,
                height: taskFocus ? "auto" : 0,
              }}
              transition={{
                opacity: { duration: 0.3 },
                height: { duration: 0.3 },
              }}
              gap="1rem"
              w="full"
            >
              <Input
                type="text"
                placeholder="Amanhã às 18h"
                border="none"
                outline="none"
                fontSize="1.3rem"
                fontWeight="bold"
                w="full"
                onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewTask((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <Separator />
            </MotionBox>

            <Input
              type="text"
              placeholder="Fazer a lição de casa..."
              border="none"
              outline="none"
              fontSize="1rem"
              w="full"
              onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                setNewTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            {taskFocus && (
              <Button w="full" colorScheme="light" onClick={createTask}>
                Criar Task
              </Button>
            )}
          </VStack>
        </VStack>
        <CardGrid
          createTaskUpdate={createTaskUpdate}
          setCreateTaskUpdate={setCreateTaskUpdate}
        />
      </VStack>
    </VStack>
  );
};

export default Todolist;
