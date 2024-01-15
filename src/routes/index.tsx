/// <reference lib="dom" />

import { Title } from "@solidjs/meta";
import { useService } from "./store/service";
import { Show, createSignal } from "solid-js";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";

export default function Home() {
  let uploadInputElement: HTMLInputElement | undefined;
  const [message, setMessage] = createSignal("Hello World!");
  const services = useService();
  const [opmode, setOpMode] = createSignal("init");
  const upload = () => {
    setMessage("Start");
    if (opmode() === "file") {
      if (uploadInputElement?.files) {
        const file = uploadInputElement.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
          services?.setting({ context: reader.result as string, op: opmode() });
          setMessage("End");
        };
      }
    } else {
      console.log(opmode());
      services?.setting({ op: opmode() });
      setMessage("End");
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setOpMode(event.target.value);
  };

  return (
    <main>
      <Title>欢迎</Title>
      <h1>{message()}</h1>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="opmode-select-label">操作模式</InputLabel>
          <Select
            labelId="opmode-select-label"
            id="opmode-select"
            value={opmode()}
            label="opMode"
            onChange={handleChange}
          >
            <MenuItem value={"init"}>初始化</MenuItem>
            <MenuItem value={"file"}>上传</MenuItem>
            <MenuItem value={"finish"}>生成索引</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Show when={opmode() === "file"}>
        <input type="file" ref={uploadInputElement} />
      </Show>
      <Button onClick={upload}>提交</Button>
    </main>
  );
}
