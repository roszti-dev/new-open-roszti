import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex grow items-center justify-center">
      <LoaderCircle className="size-14 animate-spin" />
    </div>
  );
}
