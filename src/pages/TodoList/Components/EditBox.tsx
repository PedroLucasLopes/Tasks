import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Separator,
  VStack,
  Text,
} from "@chakra-ui/react";
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
        await instance.post(`/api/subtasks/${id}`, { name });
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
        await instance.put(`/api/subtasks/${subtask_id}`, { name });
        getTaskById(id);
        setCreateTaskUpdate(true);
      } catch (err) {
        console.error(err);
      }
    },
    [getTaskById, setCreateTaskUpdate]
  );

  const toggleTaskDone = useCallback(
    async (isDone: boolean) => {
      try {
        await instance.put(`/api/tasks/${id}`, { is_done: isDone });

        setId(0);
        setTaskById((prev) => ({
          ...prev,
          is_done: isDone,
        }));

        setCreateTaskUpdate(true);
      } catch (err) {
        console.error("Erro ao atualizar o status da task:", err);
      }
    },
    [id, setId, setTaskById, setCreateTaskUpdate]
  );

  const toggleSubtaskDone = useCallback(
    async (subtaskId: number, isDone: boolean) => {
      try {
        await instance.put(`/api/subtasks/${subtaskId}`, { is_done: isDone });

        setTaskById((prev) => ({
          ...prev,
          subtasks: prev.subtasks?.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, is_done: isDone } : subtask
          ),
        }));

        setCreateTaskUpdate(true);
      } catch (err) {
        console.error("Erro ao atualizar o status da subtask:", err);
      }
    },
    [setTaskById, setCreateTaskUpdate]
  );

  return (
    <Box
      w={["100%", "40rem"]}
      h="auto"
      mt="2rem"
      p={["1rem", "2rem"]}
      borderRadius="5px"
      border="1px solid #c4c4c4"
      display="flex"
      flexDirection="column"
    >
      <HStack>
        <Checkbox
          checked={taskById.is_done!}
          onChange={() => toggleTaskDone(!taskById.is_done)}
        />
        <Input
          type="text"
          defaultValue={taskById.name}
          outline="none"
          border="none"
          fontWeight="bold"
          fontSize={["1.2rem", "1.5rem"]}
          onChange={(e) => {
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
        placeholder="Adicionar descrição"
        outline="none"
        border="none"
        fontSize={["1rem", "1.2rem"]}
        onChange={(e) => {
          setUpdateTask((prev) => ({
            ...prev,
            description: e.target.value,
          }));
        }}
      />
      <Box textAlign="left" fontSize={["1rem", "1.2rem"]} mt="1rem">
        <Text fontWeight="bold">Subtasks</Text>

        {taskById?.subtasks && taskById.subtasks.length > 0 && (
          <VStack overflowY="scroll" gap="1rem" mt=".5rem" h="10rem">
            {taskById.subtasks.map((subtask, i) => (
              <HStack
                key={i}
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                pr=".5rem"
                pl=".5rem"
              >
                <Input
                  type="text"
                  defaultValue={subtask.name}
                  textDecoration={subtask.is_done ? "line-through" : "none"}
                  outline="none"
                  border="none"
                  fontSize={["1rem", "1.2rem"]}
                  mb="-1.5rem"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    editSubtask(e.currentTarget.value, id, subtask.id!)
                  }
                />
                <Box mb="-1.5rem">
                  <Checkbox
                    checked={subtask.is_done!}
                    onChange={() =>
                      toggleSubtaskDone(subtask.id!, !subtask.is_done)
                    }
                  />
                </Box>
              </HStack>
            ))}
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
              onKeyDown={(e) =>
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
          {openInputToAddSubtask ? "Cancelar" : "Adicionar Subtask"}
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
          <Text fontSize={["1rem", "1.2rem"]}>
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
