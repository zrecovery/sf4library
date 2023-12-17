/// <reference lib="dom" />
import { Title } from "solid-start";
import { useService } from "./store/service";

export default function Home() {
  let uploadInputElement: HTMLInputElement;
  const services = useService();
  const upload = () => {
    if (uploadInputElement.files) {
      const file = uploadInputElement.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        services?.setting({ buffer: reader.result as ArrayBuffer });
      };
    }
  };
  return (
    <main>
      <Title>欢迎</Title>
      <h1>Hello World2</h1>
      <input type="file" ref={uploadInputElement} />
      <button type="button" onClick={upload}>
        上传
      </button>
    </main>
  );
}
