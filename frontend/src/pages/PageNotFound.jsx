import { Carrot, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-sm mx-auto text-center">
        <div className="relative mb-4">
          <h1 className="text-[120px] font-bold text-primary/20 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center flex-col top-1/2">
            <p className="text-xl font-bold text-foreground">Oops!</p>
            <p className="text-sm text-muted-foreground">Page Not Found</p>
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          <div className="relative">
            <Carrot className="h-16 w-16 text-orange-500 rotate-45" />
            <span className="absolute bottom-0 right-0 text-2xl">?</span>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground px-4">
          Looks like this page is out of stock! Don&apos;t worry, we have plenty
          of fresh content at our homepage.
        </p>

        <Link to="/">
          <Button size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
