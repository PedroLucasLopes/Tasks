import { Box, Grid, Text, Separator, HStack } from "@chakra-ui/react";
import instance from "../../../api/instance";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Card from "./Card";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../components/ui/pagination";
import EditBox from "./EditBox";

interface IPagination {
  per_page: number;
  total: number;
  last_page: number;
  current_page: number;
}

interface IProps {
  createTaskUpdate: boolean;
  setCreateTaskUpdate: Dispatch<SetStateAction<boolean>>;
}

const CardGrid: React.FC<IProps> = ({
  createTaskUpdate,
  setCreateTaskUpdate,
}) => {
  const [tasks, setTasks] = useState<ITasks[]>([] as ITasks[]);
  const [taskById, setTaskById] = useState<ITasks>({} as ITasks);
  const [page, setPage] = useState<IPagination>({
    per_page: 8,
    total: 0,
    last_page: 0,
    current_page: 1,
  });
  const [, setError] = useState<string | unknown>("");
  const [id, setId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateTask, setUpdateTask] = useState<ITasks>({} as ITasks);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const getTaskById = useCallback(async (id: number) => {
    try {
      const { data } = await instance.get(`/api/tasks/${id}`);
      setTaskById(data.tasks);
    } catch (err) {
      console.error("Erro ao trazer a task:", err);
    }
  }, []);

  const editTask = useCallback(
    async (id: number) => {
      try {
        await instance.put(`/api/tasks/${id}`, updateTask);
        setCreateTaskUpdate(true);
        setTaskById({} as ITasks);
        setId(0);
      } catch (err) {
        console.error("Erro ao trazer a task:", err);
      }
    },
    [setCreateTaskUpdate, updateTask]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        await instance.delete(`/api/tasks/${id}`);
        setCreateTaskUpdate(true);
        setId(0);
        setTaskById({} as ITasks);
        setOpenDelete(false);
      } catch (err) {
        console.error("Erro ao trazer a task:", err);
      }
    },
    [setCreateTaskUpdate]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await instance.get(
        `/api/tasks?page=${page.current_page}`
      );
      setCreateTaskUpdate(false);
      setPage({
        per_page: data.tasks.per_page,
        total: data.tasks.total,
        last_page: data.tasks.last_page,
        current_page: data.tasks.current_page,
      });
      setTasks(data.tasks.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page.current_page, setCreateTaskUpdate]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page.current_page, createTaskUpdate]);

  const handlePageChange = (newPage: number) => {
    console.log("ola");
    if (newPage >= 1 && newPage <= page.last_page) {
      setPage((prevPage) => ({
        ...prevPage,
        current_page: newPage,
      }));
    }
  };

  return (
    <>
      {id !== 0 && (
        <EditBox
          taskById={taskById}
          id={id}
          openDelete={openDelete}
          editTask={editTask}
          deleteTask={deleteTask}
          setUpdateTask={setUpdateTask}
          setId={setId}
          setOpenDelete={setOpenDelete}
          setTaskById={setTaskById}
          setCreateTaskUpdate={setCreateTaskUpdate}
          getTaskById={getTaskById}
        />
      )}

      <Box textAlign="left" w="100%" h="100%">
        {tasks.length > 0 && (
          <Text fontSize="1.5rem" fontWeight="bold" w="auto">
            A fazer
          </Text>
        )}
        <Separator mt="1rem" w="100%" />
        <Grid templateColumns="repeat(4, auto)" gap="6" mt="2rem">
          {tasks &&
            tasks.map((task, i) => {
              return (
                <Card
                  key={i}
                  id={task.id}
                  getTaskById={getTaskById}
                  setId={setId}
                  name={task.name}
                  description={task.description}
                  is_done={task.is_done}
                  created_at={task.created_at}
                  loading={loading}
                  updated_at={0}
                  subtasks={task.subtasks}
                />
              );
            })}
        </Grid>
        {tasks.length > 0 && (
          <PaginationRoot
            count={page.total}
            pageSize={page.per_page}
            defaultPage={page.current_page}
            justifyContent="center"
            alignItems="center"
            w="100%"
            mt="1rem"
          >
            <HStack justify="center" w="100%">
              <PaginationPrevTrigger
                onClick={() => handlePageChange(page.current_page - 1)}
              />
              <PaginationItems
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  const target = e.target as HTMLElement;
                  setPage((prev) => ({
                    ...prev,
                    current_page: Number(target.innerText),
                  }));
                }}
              />
              <PaginationNextTrigger
                onClick={() => handlePageChange(page.current_page + 1)}
              />
            </HStack>
          </PaginationRoot>
        )}
      </Box>
    </>
  );
};

export default CardGrid;
