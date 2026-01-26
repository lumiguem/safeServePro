
import React from 'react';

interface RiskBadgeProps {
    score: number;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ score }) => {
    const getColors = () => {
        if (score < 30) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (score < 60) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-rose-100 text-rose-700 border-rose-200';
    };

    const getLabel = () => {
        if (score < 30) return 'Low Risk';
        if (score < 60) return 'Medium Risk';
        return 'High Risk';
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors()}`}>
      {getLabel()} ({score})
    </span>
    );
};

export default RiskBadge;
