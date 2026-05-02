import { type ReactNode } from "react";
import Container from "@/components/ui/Container";

export default function Section({
  children,
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section className={className}>
      <Container>
        <div className={containerClassName}>{children}</div>
      </Container>
    </section>
  );
}

