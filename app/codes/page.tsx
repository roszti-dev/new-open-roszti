import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateNewCodes } from "@/lib/open-roszti-helper";

export default async function GenerateCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ quantity?: string }>;
}) {
  const { quantity } = await searchParams;

  if (!quantity) {
    return (
      <div className="flex grow items-center justify-center p-6">
        <form className="flex w-full max-w-md flex-col gap-4">
          <p className="font-semibold text-2xl">Generate Codes</p>
          <div className="space-y-2">
            <Input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              required
              min={1}
              max={1000}
            />
            <p className="text-muted-foreground text-sm">
              Enter the number of codes you want to generate (max 1000).
            </p>
          </div>
          <Button>Submit</Button>
        </form>
      </div>
    );
  }

  const codes = await generateNewCodes(parseInt(quantity, 10));

  return (
    <div className="flex grow flex-col items-center justify-center p-6">
      <p className="mb-4 font-semibold text-2xl">Generated Codes</p>
      <div className="flex flex-col">
        {codes.map((code) => (
          <div key={code} className="">
            {code}
          </div>
        ))}
      </div>
    </div>
  );
}
