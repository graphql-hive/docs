"use client";

import { cn } from "@hive/design-system";
import { SidebarCollapseTrigger } from "fumadocs-ui/components/sidebar/base";
import { Airplay, Moon, Sidebar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { Icon: Sun, key: "light" },
  { Icon: Moon, key: "dark" },
  { Icon: Airplay, key: "system" },
] as const;

export function SidebarFooter() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard mount detection for SSR theme hydration
  useEffect(() => setMounted(true), []);

  const value = mounted ? theme : null;

  return (
    <div className="flex items-center pt-1 -mb-1">
      <div
        className="inline-flex items-center rounded-full border"
        data-theme-toggle=""
      >
        {themes.map(({ Icon, key }) => (
          <button
            aria-label={key}
            className={cn(
              "size-6.5 rounded-full p-1.5",
              value === key
                ? "bg-fd-accent text-fd-accent-foreground"
                : "text-fd-muted-foreground",
            )}
            key={key}
            onClick={() => setTheme(key)}
          >
            <Icon className="size-full" fill="currentColor" />
          </button>
        ))}
      </div>
      <SidebarCollapseTrigger className="ms-auto rounded-lg p-1.5 text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground max-md:hidden">
        <Sidebar className="size-4" />
      </SidebarCollapseTrigger>
    </div>
  );
}
