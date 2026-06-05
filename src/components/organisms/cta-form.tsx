"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";

interface CtaFormProps {
  eyebrow: string;
  title: string;
  sub: string;
  labels: {
    name: string;
    phone: string;
    email: string;
    company: string;
    description: string;
  };
  placeholders: {
    name: string;
    phone: string;
    email: string;
    company: string;
    description: string;
  };
  submit: string;
  success: string;
}

export function CtaForm(props: CtaFormProps) {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
    requestAnimationFrame(() => {
      e.currentTarget?.querySelector(".cta-form__success")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-[14px] p-[clamp(28px,4vw,48px)]">
      {/* <div className="font-mono text-[12px] tracking-[0.22em] uppercase text-[var(--color-gold-500)] mb-[20px] inline-flex items-center gap-[10px] before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-[var(--color-gold-500)] before:inline-block">
        {props.eyebrow}
      </div> */}
      <h3 className="font-display font-medium tracking-[-0.02em] text-[clamp(22px,2.5vw,32px)] leading-[1.1] mb-[8px] m-0">
        {props.title}
      </h3>
      <p className="text-[var(--fg-muted)] text-[15px] mb-[28px]">{props.sub}</p>

      <form className="grid gap-[20px]" onSubmit={onSubmit}>
        <Row>
          <Field id="cf-name" label={props.labels.name} required>
            <input
              id="cf-name"
              type="text"
              required
              placeholder={props.placeholders.name}
              className={fieldClass}
            />
          </Field>
          <Field id="cf-phone" label={props.labels.phone} required>
            <input
              id="cf-phone"
              type="tel"
              required
              placeholder={props.placeholders.phone}
              className={fieldClass}
              dir="ltr"
            />
          </Field>
        </Row>
        <Row>
          <Field id="cf-email" label={props.labels.email} required>
            <input
              id="cf-email"
              type="email"
              required
              placeholder={props.placeholders.email}
              className={fieldClass}
              dir="ltr"
            />
          </Field>
          <Field id="cf-company" label={props.labels.company} required>
            <input
              id="cf-company"
              type="text"
              required
              placeholder={props.placeholders.company}
              className={fieldClass}
            />
          </Field>
        </Row>
        <Field id="cf-description" label={props.labels.description}>
          <textarea
            id="cf-description"
            rows={4}
            placeholder={props.placeholders.description}
            className={`${fieldClass} resize-y min-h-[100px]`}
          />
        </Field>

        <div className="flex items-center justify-end mt-[8px]">
          <Button type="submit" variant="primary" withArrow>
            {props.submit}
          </Button>
        </div>

        {done ? (
          <div
            className="cta-form__success mt-[16px] p-[20px] rounded-[4px] text-[var(--color-gold-700)]"
            style={{
              background: "rgba(204,16,32,0.06)",
              border: "1px solid var(--color-gold-500)",
            }}
            role="status"
            aria-live="polite"
          >
            {props.success}
          </div>
        ) : null}
      </form>
    </div>
  );
}

const fieldClass =
  "w-full bg-transparent border-0 border-b border-b-[var(--line)] py-[12px] text-[16px] text-[var(--fg)] outline-none transition-colors focus:border-b-[var(--color-navy-700)] font-inherit";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">{children}</div>;
}

function Field({
  id,
  label,
  children,
  required,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)]"
      >
        {label}
        {required ? <span className="text-[var(--color-gold-500)]"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
