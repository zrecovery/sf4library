import { A } from "solid-start";
import { AppBar, Box, Button, IconButton, Toolbar } from "@suid/material";
import ArrowBackIosNewIcon from '@suid/icons-material/ArrowBackIosNew';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={() => window.history.back()}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box>
          <Button color="inherit">
            <A href="/">首页</A>
          </Button>
          <Button color="inherit">
            <A href="/articles">文章</A>
          </Button>
          <Button color="inherit">
            <A href="/books">系列</A>
          </Button>
          <Button color="inherit">
            <A href="/authors">作者</A>
          </Button>
          <Button color="inherit">
            <A href="/create">新建</A>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
