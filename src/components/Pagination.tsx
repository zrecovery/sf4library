import { Box, Button } from "@suid/material";
import type { Accessor, Setter } from "solid-js";

interface PaginationProps {
  currentPage: Accessor<number>;
  setCurrentPage: Setter<number>;
  totalPage: Accessor<number>;
}

export function Pagination(props: PaginationProps) {
  const { currentPage, setCurrentPage, totalPage } = props;

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
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
        disabled={currentPage() <= 1}
        onClick={handlePrevPage}
      >
        上一页
      </Button>
      <p>
        {currentPage()}/{totalPage()}
      </p>
      <Button
        sx={{ justifySelf: "start" }}
        disabled={currentPage() >= totalPage()}
        onClick={handleNextPage}
      >
        下一页
      </Button>
    </Box>
  );
}
