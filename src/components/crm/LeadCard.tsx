import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateLeadScore, getScoreColor, LeadScore } from "@/utils/leadScoring";

interface LeadCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: LeadScore;
}

export const LeadCard = ({ id, name, email, phone, score }: LeadCardProps) => {
  const leadScore = score ? calculateLeadScore(score) : null;
  const scoreColor = leadScore ? getScoreColor(leadScore) : '';

  return (
    <Card className="cursor-move hover:shadow-md transition-shadow" data-type="draggable" id={id}>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          {leadScore && (
            <span className={`text-sm font-semibold ${scoreColor}`}>
              {leadScore}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1">
        <p className="text-xs text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground">{phone}</p>
      </CardContent>
    </Card>
  );
};