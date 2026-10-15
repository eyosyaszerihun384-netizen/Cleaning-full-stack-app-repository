"use client";

import { useActionState } from "react";
import { updateInquiry } from "@/app/admin/actions";
import type { InquiryActionState } from "@/lib/inquiry-action-state";
import type { Database } from "@/lib/supabase/database.types";

const initialState: InquiryActionState = {};

type InquiryStatus = Database["public"]["Enums"]["inquiry_status"];

export default function InquiryEditor({
  id,
  status,
  staffNotes,
}: {
  id: string;
  status: InquiryStatus;
  staffNotes: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    updateInquiry,
    initialState,
  );

  return (
    <form className="inquiry-editor" action={formAction}>
      <input type="hidden" name="id" value={id} />
      <label>
        Status
        <select name="status" defaultValue={status}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="scheduled">Scheduled</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <label>
        Staff notes <span className="optional">(visible only to staff)</span>
        <textarea
          name="staff_notes"
          rows={8}
          maxLength={8000}
          defaultValue={staffNotes ?? ""}
        />
      </label>
      {state.message && (
        <p
          className={`form-status${state.success ? "" : " form-error"}`}
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      )}
      <button className="button button-dark" type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
