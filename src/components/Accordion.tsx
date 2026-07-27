import type { PropsWithChildren } from "react";

interface AccordionProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  open?: boolean;
}

export function Accordion({ title, eyebrow, open = false, children }: AccordionProps) {
  return (
    <details className="accordion" open={open}>
      <summary>
        <span>
          {eyebrow && <small>{eyebrow}</small>}
          {title}
        </span>
        <span aria-hidden="true" className="accordion__icon">＋</span>
      </summary>
      <div className="accordion__body">{children}</div>
    </details>
  );
}
