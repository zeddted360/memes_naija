import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertErr({title}:{title:string}) {
  return (
    <Alert className="mt-4" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-red-500 ">Error</AlertTitle>
      <AlertDescription>
       {title}
      </AlertDescription>
    </Alert>
  );
}
