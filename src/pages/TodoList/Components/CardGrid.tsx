import { Box, Grid, Text, Separator } from "@chakra-ui/react";
import instance from "../../../api/instance";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Card from "./Card";
import EditBox from "./EditBox";
import Pagination from "./Pagination";

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

  const taskIsNotDone =
    tasks.length > 0 && tasks.some((task) => Boolean(task.is_done) !== true);
  const taskIsDone =
    tasks.length > 0 && tasks.some((task) => Boolean(task.is_done) === true);

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
        console.error("Erro ao editar a task:", err);
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
        console.error("Erro ao deletar a task:", err);
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
        {taskIsNotDone && (
          <>
            <Text
              fontSize={{ base: "1.25rem", md: "1.5rem" }}
              fontWeight="bold"
              w="auto"
            >
              A fazer
            </Text>
            <Separator mt="1rem" w="100%" />
          </>
        )}
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap="6"
          mt="2rem"
        >
          {tasks &&
            tasks
              .filter((task) => Boolean(task.is_done) !== true)
              .map((task, i) => {
                return (
                  <Card
                    key={i}
                    id={task.id}
                    getTaskById={getTaskById}
                    setId={setId}
                    name={task.name}
                    description={task.description}
                    is_done={task.is_done!}
                    created_at={task.created_at}
                    loading={loading}
                    updated_at={0}
                    subtasks={task.subtasks}
                  />
                );
              })}
        </Grid>
        {taskIsNotDone && (
          <Pagination
            page={page}
            setPage={setPage}
            handlePageChange={handlePageChange}
          />
        )}
        {taskIsDone && (
          <>
            <Text
              fontSize={{ base: "1.25rem", md: "1.5rem" }}
              fontWeight="bold"
              w="auto"
            >
              Feito
            </Text>
            <Separator />
          </>
        )}
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap="6"
          mt="2rem"
        >
          {tasks &&
            tasks
              .filter((task) => Boolean(task.is_done) === true)
              .map((task, i) => {
                return (
                  <Card
                    key={i}
                    id={task.id}
                    getTaskById={getTaskById}
                    setId={setId}
                    name={task.name}
                    description={task.description}
                    is_done={task.is_done!}
                    created_at={task.created_at}
                    loading={loading}
                    updated_at={0}
                    subtasks={task.subtasks}
                  />
                );
              })}
        </Grid>
        {taskIsDone && (
          <Pagination
            page={page}
            setPage={setPage}
            handlePageChange={handlePageChange}
          />
        )}
      </Box>
    </>
  );
};

export default CardGrid;
