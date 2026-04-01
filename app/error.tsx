"use client"; // Error boundaries must be Client Components

import { OctagonX } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="flex size-18 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <OctagonX className="size-10" />
      </div>
      <p className="mt-5 font-semibold text-2xl">Something Went Wrong</p>
      <p className="mt-1 w-full max-w-xs text-center text-muted-foreground">
        It seems something went wrong while loading the page. Please try
        refreshing or come back later.
      </p>
    </div>
  );
}
