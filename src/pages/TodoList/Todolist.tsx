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
import Navbar from "../../components/Navbar/Navbar";

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
      setNewTask({} as ITasks);
    } catch (err) {
      console.error("Erro ao criar task:", err);
      setTaskFocus(false);
    }
  }, [newTask]);

  return (
    <>
      <Navbar />
      <VStack w="100%" h="100%" justify="center" alignItems="center" p="2rem">
        <VStack gap={6}>
          <VStack
            w={["100%", "20rem"]}
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Text fontWeight="semibold" fontSize={["1rem", "1.3rem"]}>
              Adicionar Task
            </Text>
            <VStack
              w={["100%", "30rem"]}
              h="auto"
              p="1rem"
              border="1px solid"
              borderColor="black"
              borderRadius="5px"
              transition="all 0.3s ease-in-out"
              onFocus={onFocusTaskContainer}
              gap={4}
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
                  fontSize={["1rem", "1.3rem"]}
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
                fontSize={["0.875rem", "1rem"]}
                w="full"
                onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />

              {taskFocus && (
                <Button w="full" colorScheme="blue" onClick={createTask}>
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
    </>
  );
};

export default Todolist;
