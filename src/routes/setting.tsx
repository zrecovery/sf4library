import { Title } from "@solidjs/meta";
import { useService } from "./store/service";
import { Show, createSignal } from "solid-js";
import { Box, Button } from "@suid/material";
import type { SelectChangeEvent } from "@suid/material/Select";

export default function Setting() {
  let uploadInputElement: HTMLInputElement | undefined;

  const [message, setMessage] = createSignal("Hello World!");
  const [opmode, setOpMode] = createSignal("init");

  const services = useService();

  const uploadSqlFile = (
    file: Blob,
    callback: (result: FileReader["result"]) => void,
  ) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => callback(reader.result);
  };

  const handleUploadSqlFile = async (
    fileRaderResult: string | ArrayBuffer | null,
  ) => {
    const result = services?.setting({
      context: fileRaderResult as string,
      op: opmode(),
    });
    const message = await result;
    console.log(message);
    setMessage(result ? ((await result) as string) : typeof message);
  };

  const upload = async () => {
    setMessage("Start");
    if (opmode() === "file") {
      if (uploadInputElement?.files) {
        const file = uploadInputElement.files[0];
        uploadSqlFile(file, handleUploadSqlFile);
      }
    } else {
      const result = (await services?.setting({ op: opmode() })) as string;
      setMessage(result ?? "Undefined");
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
        <h1>{opmode()}</h1>
        <select onChange={handleChange}>
          <option value="init">初始化</option>
          <option value="file">上传</option>
          <option value="finish">生成索引</option>
        </select>
        <Show when={opmode() === "file"}>
          <input type="file" ref={uploadInputElement} />
        </Show>
        <Button onClick={upload}>提交</Button>
      </Box>
    </main>
  );
}
