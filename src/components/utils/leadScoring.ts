export interface LeadScore {
  engagement: number;    // 0-100
  budget: number;        // 0-100
  timing: number;        // 0-100
  authority: number;     // 0-100
}

export const calculateLeadScore = (score: LeadScore): number => {
  const weights = {
    engagement: 0.3,
    budget: 0.3,
    timing: 0.2,
    authority: 0.2
  };

  return Math.round(
    score.engagement * weights.engagement +
    score.budget * weights.budget +
    score.timing * weights.timing +
    score.authority * weights.authority
  );
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
};