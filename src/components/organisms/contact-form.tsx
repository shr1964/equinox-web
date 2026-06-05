"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { sendContactAction, type ContactFormState } from "@/app/actions/send-contact";

interface ContactFormProps {
  eyebrow: string;
  title: string;
  sub: string;
  labels: {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: string;
    route: string;
    message: string;
  };
  placeholders: {
    name: string;
    company: string;
    email: string;
    phone: string;
    route: string;
    message: string;
  };
  services: string[];
  reply: string;
  submit: string;
  success: string;
  error: string;
}

const BANNER_TTL = 7000;

/**
 * Contact form using bottom-border underline styling (matches `.field` in
 * prototype). HeroUI's primitives aren't used here — the design's tight
 * underline-only look is easier with native inputs styled by class.
 */
export function ContactForm(props: ContactFormProps) {
  const [state, action, isPending] = useActionState<ContactFormState, FormData>(
    sendContactAction,
    null,
  );
  const [showBanner, setShowBanner] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === null) return;

    if (state.success) formRef.current?.reset();

    setShowBanner(true);
    requestAnimationFrame(() => {
      bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const t = setTimeout(() => setShowBanner(false), BANNER_TTL);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-[14px] p-[clamp(32px,4vw,56px)]">
      <div className="font-mono text-[12px] tracking-[0.22em] uppercase text-[var(--color-gold-500)] mb-[24px] inline-flex items-center gap-[10px] before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-[var(--color-gold-500)] before:inline-block">
        {props.eyebrow}
      </div>
      <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(28px,3vw,40px)] leading-[1.1] mb-[8px] m-0">
        {props.title}
      </h2>
      <p className="text-[var(--fg-muted)] text-[15px] mb-[32px]">{props.sub}</p>

      <form ref={formRef} action={action} className="grid gap-[22px]">
        <Row>
          <Field id="f-name" label={props.labels.name} required>
            <input
              id="f-name"
              name="fullName"
              type="text"
              required
              placeholder={props.placeholders.name}
              className={fieldClass}
            />
          </Field>
          <Field id="f-co" label={props.labels.company}>
            <input
              id="f-co"
              name="company"
              type="text"
              placeholder={props.placeholders.company}
              className={fieldClass}
            />
          </Field>
        </Row>
        <Row>
          <Field id="f-email" label={props.labels.email} required>
            <input
              id="f-email"
              name="email"
              type="email"
              required
              placeholder={props.placeholders.email}
              className={fieldClass}
              dir="ltr"
            />
          </Field>
          <Field id="f-phone" label={props.labels.phone}>
            <input
              id="f-phone"
              name="phone"
              type="tel"
              placeholder={props.placeholders.phone}
              className={fieldClass}
              dir="ltr"
            />
          </Field>
        </Row>
        <Row>
          <Field id="f-service" label={props.labels.service}>
            <select
              id="f-service"
              name="service"
              className={fieldClass}
              defaultValue={props.services[0]}
            >
              {props.services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field id="f-route" label={props.labels.route}>
            <input
              id="f-route"
              name="route"
              type="text"
              placeholder={props.placeholders.route}
              className={fieldClass}
            />
          </Field>
        </Row>
        <Field id="f-message" label={props.labels.message}>
          <textarea
            id="f-message"
            name="description"
            rows={4}
            placeholder={props.placeholders.message}
            className={`${fieldClass} resize-y min-h-[100px]`}
          />
        </Field>

        <div className="flex items-center justify-between mt-[12px] flex-wrap gap-[16px]">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--fg-muted)]">
            {props.reply}
          </div>
          <Button type="submit" variant="primary" withArrow disabled={isPending}>
            {isPending ? "Sending…" : props.submit}
          </Button>
        </div>

        {showBanner && state !== null && (
          <div
            ref={bannerRef}
            className="mt-[24px] p-[20px] rounded-[4px] text-[15px] leading-[1.5]"
            style={
              state.success
                ? {
                    color: "#166534",
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.4)",
                  }
                : {
                    color: "#a80e1a",
                    background: "rgba(168,14,26,0.06)",
                    border: "1px solid #a80e1a",
                  }
            }
            role="status"
            aria-live="polite"
          >
            {state.success ? props.success : props.error}
          </div>
        )}
      </form>
    </div>
  );
}

const fieldClass =
  "w-full bg-transparent border-0 border-b border-b-[var(--line)] py-[12px] text-[16px] text-[var(--fg)] outline-none transition-colors focus:border-b-[var(--color-gold-500)] font-inherit";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">{children}</div>;
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
