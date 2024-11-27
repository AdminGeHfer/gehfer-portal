import { Card, CardContent, CardHeader } from "./card";

export function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-6 w-1/3 bg-muted rounded"></div>
        <div className="h-4 w-2/3 bg-muted rounded"></div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </CardContent>
    </Card>
  );
}