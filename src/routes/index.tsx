/// <reference lib="dom" />

import { Title } from "@solidjs/meta";
import { useService } from "./store/service";
import { createSignal } from "solid-js";

export default function Home() {
  let uploadInputElement: HTMLInputElement | undefined;
  const [message, setMessage] = createSignal("Hello World!");
  const services = useService();
  const upload = () => {
    setMessage("Start");
    if (uploadInputElement?.files) {
      const file = uploadInputElement.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        services?.setting({ context: reader.result as string });
        setMessage("End");
      };
    }
  };
  return (
    <main>
      <Title>欢迎</Title>
      <h1>{message()}</h1>
      <input type="file" ref={uploadInputElement} />
      <button type="button" onClick={upload}>
        上传
      </button>
    </main>
  );
}
