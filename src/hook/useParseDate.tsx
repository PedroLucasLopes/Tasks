import { useCallback } from "react";

const useParseDate = () => {
  const parseDate = useCallback((created_at: number) => {
    const date = new Date(created_at);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  return parseDate;
};

export default useParseDate;
