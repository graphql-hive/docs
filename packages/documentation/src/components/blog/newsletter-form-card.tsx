"use client";

import { CallToAction, Heading, Input } from "@hive/design-system";
import { cn } from "@hive/design-system/cn";
import { useState } from "react";

type Idle = undefined;
type Pending = {
  message: string | undefined;
  status: "pending";
};
type Success = { message: string; status: "success" };
type Error = { message: string; status: "error" };
type State = Error | Idle | Pending | Success;

export function NewsletterFormCard(props: React.HTMLAttributes<HTMLElement>) {
  const [state, setState] = useState<State>();

  return (
    <article
      {...props}
      className={cn(
        props.className,
        "bg-primary dark:bg-primary/95 light @container/card text-green-1000 relative rounded-2xl",
      )}
    >
      <div className="p-6 pb-0">
        <Heading
          as="h3"
          className="@[354px]/card:text-5xl/[56px] @[354px]/card:tracking-[-0.48px]"
          size="xs"
        >
          Stay in the loop
        </Heading>
        <p className="relative mt-4">
          Get the latest insights and best practices on GraphQL API management
          delivered straight to your inbox.
        </p>
      </div>
      <form
        className="relative z-10 p-6"
        onReset={() => {
          setState(undefined);
        }}
        onSubmit={async (event) => {
          event.preventDefault();
          const email = (
            event.currentTarget.elements.namedItem("email") as HTMLInputElement
          )?.value;

          if (!email?.includes("@")) {
            setState({
              message: "Please enter a valid email address.",
              status: "error",
            });
            return;
          }

          setState((s) => ({
            message: s?.status === "error" ? "Retrying..." : undefined,
            status: "pending",
          }));

          try {
            const response = await fetch(
              "https://utils.the-guild.dev/api/newsletter-subscribe",
              {
                body: JSON.stringify({ email }),
                method: "POST",
              },
            );

            const json = await response.json();
            if (json.status === "success") {
              setState({
                message: "Please check your email to confirm.",
                status: "success",
              });
            } else {
              setState({ message: json.message, status: "error" });
            }
          } catch (error: unknown) {
            if (!navigator.onLine) {
              setState({
                message: "Please check your internet connection and try again.",
                status: "error",
              });
              return;
            }

            if (error instanceof Error && error.message !== "Failed to fetch") {
              setState({ message: error.message, status: "error" });
              return;
            }

            setState({
              message: "Something went wrong. Please let us know.",
              status: "error",
            });
          }
        }}
      >
        <Input
          message={state?.message}
          name="email"
          onChange={() => {
            if (state?.status === "success") {
              setState(undefined);
            }
          }}
          placeholder="E-mail"
          severity={
            state?.status === "error"
              ? "critical"
              : state?.status === "success"
                ? "positive"
                : undefined
          }
        />
        {!state || state.status === "error" ? (
          <CallToAction
            className="mt-2 w-full!"
            type="submit"
            variant="secondary-inverted"
          >
            Subscribe
          </CallToAction>
        ) : state.status === "pending" ? (
          <CallToAction
            className="mt-2 w-full!"
            disabled
            type="submit"
            variant="secondary-inverted"
          >
            Subscribing...
          </CallToAction>
        ) : state.status === "success" ? (
          <CallToAction
            className="group/button mt-2 w-full! before:absolute"
            type="reset"
            variant="secondary-inverted"
          >
            <span className="group-hover/button:hidden group-focus/button:hidden">
              Subscribed
            </span>
            <span
              aria-hidden
              className="hidden group-hover/button:block group-focus/button:block"
            >
              Another email?
            </span>
          </CallToAction>
        ) : null}
      </form>
      <DecorationArch className="absolute bottom-0 right-0" color="#A2C1C4" />
    </article>
  );
}

function DecorationArch({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      height="200"
      viewBox="0 0 200 200"
      width="200"
    >
      <path
        d="M6.72485 73.754C2.74132 77.7375 0.499999 83.1445 0.499999 88.7742L0.499998 199.5L41.2396 199.5L41.2396 74.3572C41.2396 56.0653 56.0652 41.2396 74.3571 41.2396L199.5 41.2396L199.5 0.500033L88.7741 0.500032C83.1444 0.500032 77.7374 2.74135 73.7539 6.72488L42.0931 38.3857L38.3856 42.0932L6.72485 73.754Z"
        stroke="url(#paint0_linear_2735_2359)"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_2735_2359"
          x1="100"
          x2="6.24999"
          y1="104.605"
          y2="3.28952"
        >
          <stop stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
