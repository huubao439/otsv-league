"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type LoginState, loginAction } from "@/app/admin/auth-actions";

const fieldClass =
  "w-full rounded-xl border border-border bg-[var(--surface-2)] px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors focus:border-[var(--pink)]";
const labelClass =
  "font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      data-testid="admin-login-submit"
      className="rounded-full bg-[image:var(--grad)] px-4.5 py-2.5 text-[12.5px] font-extrabold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-[20px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]"
    >
      <input type="hidden" name="from" value={from} />

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Username</span>
        <input
          name="username"
          autoComplete="username"
          autoFocus
          required
          className={fieldClass}
          data-testid="admin-login-username"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
          data-testid="admin-login-password"
        />
      </label>

      {state.error ? (
        <p role="alert" data-testid="admin-login-error" className="m-0 text-[11.5px] font-semibold text-[var(--pink)]">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
