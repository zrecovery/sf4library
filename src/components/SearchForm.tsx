import { Box, Fade, FormControlLabel } from "@suid/material";

export function SearchForm(props) {
    const { checked } = props
    return (<Box>
        <Fade in={checked()}>
            <FormControlLabel />
        </Fade>
    </Box>)

}
