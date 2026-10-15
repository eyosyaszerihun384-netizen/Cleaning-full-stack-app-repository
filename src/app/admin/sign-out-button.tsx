"use client";

import { useFormStatus } from "react-dom";

function SignOutSubmit() {
  const { pending } = useFormStatus();

  return (
    <button className="button button-small button-outline" disabled={pending}>
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

export default function SignOutButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form action={action}>
      <SignOutSubmit />
    </form>
  );
}
