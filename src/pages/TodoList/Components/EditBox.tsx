import {
  Box,
  Button,
  HStack,
  Input,
  Separator,
  VStack,
  Text,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import instance from "../../../api/instance";
import Checkbox from "../../../components/checkbox/Checkbox";

interface IProps {
  taskById: ITasks;
  id: number;
  openDelete: boolean;
  deleteTask: (id: number) => void;
  editTask: (id: number) => void;
  setUpdateTask: Dispatch<SetStateAction<ITasks>>;
  setTaskById: Dispatch<SetStateAction<ITasks>>;
  setId: Dispatch<SetStateAction<number>>;
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
  setCreateTaskUpdate: Dispatch<SetStateAction<boolean>>;
  getTaskById: (id: number) => void;
}

const EditBox: React.FC<IProps> = ({
  taskById,
  openDelete,
  id,
  setUpdateTask,
  setId,
  setOpenDelete,
  setTaskById,
  deleteTask,
  setCreateTaskUpdate,
  editTask,
  getTaskById,
}) => {
  const [openInputToAddSubtask, setOpenInputToAddSubtask] =
    useState<boolean>(false);

  const addSubtask = useCallback(
    async (name: string) => {
      try {
        await instance.post(`/api/subtasks/${id}`, { name: name });
        getTaskById(id);
        setCreateTaskUpdate(true);
      } catch (err) {
        console.error(err);
      }
    },
    [getTaskById, id, setCreateTaskUpdate]
  );

  const editSubtask = useCallback(
    async (name: string, id: number, subtask_id: number) => {
      try {
        await instance.put(`/api/subtasks/${subtask_id}`, { name: name });
        getTaskById(id);
        setCreateTaskUpdate(true);
      } catch (err) {
        console.error(err);
      }
    },
    [getTaskById, setCreateTaskUpdate]
  );

  return (
    <Box
      w="40rem"
      h="auto"
      mt="2rem"
      p="2rem"
      borderRadius="5px"
      border="1px solid #c4c4c4"
      display="flex"
      flexDirection="column"
    >
      <HStack>
        <Input
          type="text"
          defaultValue={taskById.name}
          outline="none"
          border="none"
          fontWeight="bold"
          fontSize="1.5rem"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUpdateTask((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />
        <IoMdClose
          cursor="pointer"
          onClick={() => {
            setId(0);
            setTaskById({} as ITasks);
          }}
          size="1.5rem"
        />
      </HStack>
      <Separator />
      <Input
        type="text"
        defaultValue={taskById.description}
        outline="none"
        border="none"
        fontSize="1.2rem"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUpdateTask((prev) => ({
            ...prev,
            description: e.target.value,
          }));
        }}
      />
      <Box textAlign="left" fontSize="1.2rem" mt="1rem">
        <Text fontWeight="bold">Subtasks</Text>

        {taskById?.subtasks && taskById.subtasks.length > 0 && (
          <VStack overflowY="scroll" gap="1rem" mt=".5rem" h="10rem">
            {taskById.subtasks.map((subtask, i) => {
              return (
                <HStack
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  pr=".5rem"
                  pl=".5rem"
                >
                  <Input
                    key={i}
                    type="text"
                    defaultValue={subtask.name}
                    outline="none"
                    border="none"
                    fontSize="1rem"
                    mb="-1.5rem"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" &&
                      editSubtask(e.currentTarget.value, id, subtask.id!)
                    }
                  />
                  <Box mb="-1.5rem">
                    <Checkbox checked={subtask.is_done!} />
                  </Box>
                </HStack>
              );
            })}
          </VStack>
        )}
        {openInputToAddSubtask && (
          <HStack>
            <Input
              type="text"
              outline="none"
              border="none"
              mb="1rem"
              borderBottom="1px solid #c4c4c4"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && addSubtask(e.currentTarget.value)
              }
            />
          </HStack>
        )}
        <Button
          variant="plain"
          _hover={{
            backgroundColor: "#c4c4c496",
            transition: "all ease-in-out",
          }}
          onClick={() => setOpenInputToAddSubtask(!openInputToAddSubtask)}
        >
          <IoMdAdd />
          Adicionar Subtask
        </Button>
      </Box>
      <HStack w="100%">
        <Button w="50%" pb="0" mb="0" mt="1rem" onClick={() => editTask(id)}>
          Confirmar Alteração
        </Button>
        <Button
          w="50%"
          pb="0"
          mb="0"
          mt="1rem"
          colorPalette="red"
          onClick={() => setOpenDelete(true)}
        >
          Excluir Task
        </Button>
      </HStack>
      {openDelete && (
        <VStack mt="1rem">
          <Text fontSize="1.2rem">
            Tem certeza que deseja excluir essa task?
          </Text>
          <HStack>
            <Button onClick={() => deleteTask(id)}>Sim</Button>
            <Button onClick={() => setOpenDelete(false)}>Não</Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default EditBox;
