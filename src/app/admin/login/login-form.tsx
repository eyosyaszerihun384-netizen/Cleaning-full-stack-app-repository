"use client";

import { useActionState } from "react";
import { signInStaff, type StaffActionState } from "@/app/admin/actions";

const initialState: StaffActionState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInStaff,
    initialState,
  );

  return (
    <form className="staff-login-form" action={formAction}>
      <label>
        Email address
        <input
          autoComplete="username"
          type="email"
          name="email"
          required
          maxLength={320}
        />
      </label>
      <label>
        Password
        <input
          autoComplete="current-password"
          type="password"
          name="password"
          required
          maxLength={256}
        />
      </label>
      {state.message && (
        <p className="form-status form-error" role="alert">
          {state.message}
        </p>
      )}
      <button className="button button-dark" type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
