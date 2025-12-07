import { ReactNode } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export function Wrapper({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}