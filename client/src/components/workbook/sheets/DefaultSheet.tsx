import { Table } from "lucide-react";

interface DefaultSheetProps {
  sheetName: string;
}

export default function DefaultSheet({ sheetName }: DefaultSheetProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Table className="h-8 w-8 opacity-50" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{sheetName}</h3>
      <p className="text-sm max-w-md text-center">
        This calculation module is part of the 44-sheet suite. 
        Input data from previous sheets will automatically populate this matrix once configured.
      </p>
      <div className="mt-8 grid grid-cols-6 gap-1 w-full max-w-2xl opacity-20 select-none pointer-events-none">
         {[...Array(24)].map((_, i) => (
           <div key={i} className="h-8 border bg-muted/30"></div>
         ))}
      </div>
    </div>
  );
}
