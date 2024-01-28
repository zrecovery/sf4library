import { services } from "../../application/app";
import { ServiceContext } from "./service";
import type { JSX } from "solid-js";

export function ServiceProvider(props: { children: JSX.Element }) {
  return (
    <ServiceContext.Provider value={services}>
      {props.children}
    </ServiceContext.Provider>
  );
}
