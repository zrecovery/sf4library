import { A } from "@solidjs/router";
import MenuIcon from "@suid/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
} from "@suid/material";

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon />
                </IconButton>
                <Box>
                    <Button color="inherit" >
                        <A href="/">首页</A>
                    </Button>
                    <Button color="inherit">
                        <A href="/articles">文章</A>
                    </Button>
                    <Button color="inherit" >
                        <A href="/books">系列</A>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
