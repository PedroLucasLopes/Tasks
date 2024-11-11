import { HStack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../components/ui/pagination";

interface IProps {
  page: IPagination;
  setPage: Dispatch<SetStateAction<IPagination>>;
  handlePageChange: (e: number) => void;
}

const Pagination: React.FC<IProps> = ({ page, setPage, handlePageChange }) => {
  return (
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
  );
};

export default Pagination;
