import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getData, getNameByCode } from "@/lib/open-roszti-helper";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (!code) {
    return (
      <div className="flex grow items-center justify-center p-6">
        <form className="flex w-full max-w-md flex-col gap-4">
          <p className="font-semibold text-2xl">Log In</p>
          <div className="space-y-2">
            <Input
              type="text"
              name="code"
              placeholder="Enter your code"
              required
              minLength={6}
              pattern="(?=(?:.*[a-zA-Z]){4})(?=(?:.*\d){2}).{6,}"
            />
            <p className="text-muted-foreground text-sm">
              Your RÖszTI code have been provided via email. If you forgot it,
              please get in contact with the VP of Administration.
            </p>
          </div>
          <Button>Submit</Button>
        </form>
      </div>
    );
  }

  const name = await getNameByCode(code || "LDRL85");

  const range = "2025-2026 tavasz";

  const data = await getData(range, name);

  const status = data
    .find((item) => item.event === "Státusz")
    ?.value.toString();
  const score = data
    .find((item) => item.event === "Elért pontszám")
    ?.value.toString();
  const activity = data
    .find((item) => item.event === "Szavazati jog / Aktivitás")
    ?.value.toString();

  return (
    <div className="p-6">
      <p className="whitespace-pre-wrap"></p>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex items-center gap-x-1.5 font-medium text-lg">
          <User className="size-5 text-primary" />
          {name}
        </p>
        <p className="text-primary">{range}</p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-md border bg-secondary p-4 text-center">
          <p className="font-medium">Státusz</p>
          <p className="font-semibold text-3xl">{status}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border bg-secondary p-4 text-center">
          <p className="font-medium">Elért pontszám</p>
          <p className="font-semibold text-3xl">{score || "-"}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border bg-secondary p-4 text-center">
          <p className="font-medium">Szavazati jog / Aktivitás</p>
          <p className="font-semibold text-3xl">{activity}</p>
        </div>
      </div>
      <p className="my-4 font-semibold text-2xl">Events</p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {score !== undefined ? (
          data
            .filter(
              (item) =>
                item.event !== "Státusz" &&
                item.event !== "Elért pontszám" &&
                item.event !== "Szavazati jog / Aktivitás" &&
                item.event !== "Aktív tag",
            )
            .map((item) => (
              <div
                key={item.event}
                className="rounded-md border border-primary/10 bg-primary/5 p-2"
              >
                <p className="font-medium">{item.event}</p>
                <p className="font-semibold text-xl">{item.value.toString()}</p>
              </div>
            ))
        ) : (
          <div className="">No Activity</div>
        )}
      </div>
    </div>
  );
}
