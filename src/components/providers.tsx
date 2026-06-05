"use client";

import { useCallback } from "react";
import { RouterProvider, I18nProvider } from "@heroui/react/rac";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * HeroUI v3 is built on react-aria-components and ships RouterProvider /
 * I18nProvider for client-side navigation + locale propagation. There is no
 * single "HeroUIProvider" in v3.
 */
export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const router = useRouter();
  // Stable navigate identity so RouterContext consumers in react-aria
  // don't re-render on every parent render.
  const navigate = useCallback(
    (href: string) => router.push(href as never),
    [router],
  );
  return (
    <I18nProvider locale={locale}>
      <RouterProvider navigate={navigate}>{children}</RouterProvider>
    </I18nProvider>
  );
}
