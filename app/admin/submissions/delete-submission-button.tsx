"use client";

type DeleteSubmissionButtonProps = {
  id: string;
};

export function DeleteSubmissionButton({ id }: DeleteSubmissionButtonProps) {
  return (
    <form
      action="/api/admin/submissions/delete"
      method="post"
      onSubmit={(event) => {
        const confirmed = window.confirm("Delete this submission permanently? This will remove it from the dashboard and database.");
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="button button-secondary button-small" type="submit">
        Delete
      </button>
    </form>
  );
}
