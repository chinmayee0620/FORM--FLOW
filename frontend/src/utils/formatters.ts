/**
 * Reusable formatting utilities for FormFlow
 */

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getScoreColor = (score: number): {
  text: string;
  bg: string;
  border: string;
} => {
  if (score >= 80) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
  }
  return {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  };
};
