import { Box, Button } from "@suid/material";
import { Accessor, Setter } from "solid-js";

interface PaginationProps {
  page: Accessor<number>;
  setPage: Setter<number>;
  action: Function;
}

export function Pagination(props: PaginationProps) {
  const { page, setPage, action } = props;

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
    action();
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
    action();
  };

  return (
    <Box
      maxWidth="100"
      sx={{
        display: "grid",
        gridTemplateAreas: '"prev page next"',
        justifyItems: "center",
      }}
    >
      <Button
        sx={{ justifySelf: "end" }}
        disabled={page() <= 1}
        onClick={handlePrevPage}
      >
        上一页
      </Button>
      <p>{page()}</p>
      <Button
        sx={{ justifySelf: "start" }}
        onClick={handleNextPage}
      >
        下一页
      </Button>
    </Box>
  );
}
