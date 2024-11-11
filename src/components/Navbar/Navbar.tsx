import { Box, HStack } from "@chakra-ui/react";
import { FaGithub, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <HStack
      w="100vw"
      h="5rem"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#c4c4c4"
      gap="2rem"
    >
      <Box fontSize="2rem" cursor="pointer" onClick={() => navigate("/")}>
        <FaList />
      </Box>
      <Box fontSize="2rem" cursor="pointer" onClick={() => navigate("/github")}>
        <FaGithub />
      </Box>
    </HStack>
  );
};

export default Navbar;
