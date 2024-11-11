import {
  Box,
  Input,
  VStack,
  Text,
  HStack,
  Card,
  Link,
  Stack,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar/Navbar";
import { ChangeEvent, useCallback, useState } from "react";
import axios from "axios";
import useParseDate from "../../hook/useParseDate";
import { SkeletonText } from "../../components/ui/skeleton";

const Github = () => {
  const parseDate = useParseDate();
  const [user, setUser] = useState<string>("");
  const [repos, setRepos] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleGithubUser = useCallback(async () => {
    try {
      setLoading(true);
      const getUser = await axios.get(
        `${import.meta.env.VITE_GITHUB_TOKEN}/${user}/repos`
      );
      console.log(getUser.data);
      setRepos(getUser.data);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);
  return (
    <>
      <Navbar />
      <VStack w="100%" h="100%" justify="center" alignItems="center" p="2rem">
        <Box>
          <Text
            textAlign="center"
            fontSize="1.3rem"
            fontWeight="semibold"
            mb=".5rem"
          >
            Procurar Usuário
          </Text>
          <HStack
            border="1px solid #c4c4c4"
            pl="1rem"
            pr="1rem"
            borderRadius="3px"
          >
            <Input
              type="text"
              w="20rem"
              placeholder="Ex: Octokid"
              outline="none"
              border="none"
              onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                setUser(e.target.value);
              }}
            />
            <IoSearchOutline cursor="pointer" onClick={handleGithubUser} />
          </HStack>
        </Box>
        {loading ? (
          <Stack gap="6" w="30rem" h="15rem">
            <VStack width="full">
              <SkeletonText noOfLines={1} mb="2rem" />
              <SkeletonText noOfLines={3} />
              <SkeletonText noOfLines={1} mt="2rem" />
            </VStack>
          </Stack>
        ) : (
          <>
            <HStack
              justifyContent="center"
              alignItems="center"
              mt="1rem"
              mb="1rem"
            >
              <Box w="6rem" h="6rem" borderRadius="full" overflow="hidden">
                {repos.length > 0 && (
                  <img src={repos[0]?.owner?.avatar_url} alt="Avatar" />
                )}
              </Box>
              <Text fontSize="2rem">{repos[0]?.owner?.login}</Text>
            </HStack>
            {repos &&
              repos.map((repo: unknown, i) => {
                return (
                  <Card.Root width="30rem" key={i}>
                    <Card.Body gap="2">
                      <Card.Title mt="2">
                        <Link href={repo?.svn_url} target="_blank">
                          {repo?.name}
                        </Link>
                      </Card.Title>
                      <Card.Description>{repo?.description}</Card.Description>
                    </Card.Body>
                    <Card.Footer>
                      <Text>
                        Última atualização: {parseDate(repo?.updated_at)}
                      </Text>
                    </Card.Footer>
                  </Card.Root>
                );
              })}
          </>
        )}
      </VStack>
    </>
  );
};

export default Github;
