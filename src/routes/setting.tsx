import { Title } from "@solidjs/meta";
import { useService } from "./store/service";
import { createSignal } from "solid-js";
import { Box, Button } from "@suid/material";

export default function Setting() {
  let uploadInputElement: HTMLInputElement | undefined;

  const [message, setMessage] = createSignal("Hello World!");

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
      context: fileRaderResult as string
    });
    const message = await result;
    setMessage(result ? ((await result) as string) : typeof message);
  };

  const upload = async () => {
    setMessage("Start");
    if (uploadInputElement?.files) {
      const file = uploadInputElement.files[0];
      uploadSqlFile(file, handleUploadSqlFile);
    }
  };

  return (
    <main>
      <Title>欢迎</Title>
      <h1>{message()}</h1>
      <Box sx={{ minWidth: 120 }}>
        <input type="file" ref={uploadInputElement} />
        <Button onClick={upload}>提交</Button>
      </Box>
    </main>
  );
}
