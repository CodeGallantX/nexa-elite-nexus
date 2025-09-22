import React from 'react';

interface Activity {
  id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  target_user_id: string;
  old_value: any;
  new_value: any;
  created_at: string;
  performer?: {
    username: string;
    ign: string;
  };
  target?: {
    username: string;
    ign: string;
  };
}

interface ActivitySummaryProps {
  activity: Activity;
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(dateString));
};

const formatFieldName = (name: string) => {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'nothing';
    if (typeof value === 'object') return 'details';
    if (String(value).trim() === '') return 'empty';
    return value;
}

const generateUpdatePlayerSummary = (activity: Activity) => {
    const { old_value, new_value } = activity;
    if (!old_value || !new_value) return `updated ${activity.target?.ign || 'a player'}'s profile.`;

    const changes = [];
    const ignored = ['id', 'player_uid', 'created_at', 'updated_at', 'user_id', 'avatar_url', 'username', 'ign', 'date_joined', 'kills', 'attendance', 'device', 'best_gun', 'br_class', 'mp_class', 'tiktok_handle', 'preferred_mode'];

    for (const key in new_value) {
        if (ignored.includes(key)) continue;

        const from = old_value[key];
        const to = new_value[key];

        if (JSON.stringify(from) !== JSON.stringify(to)) {
            if (from !== undefined && from !== null && (to === undefined || to === null || to === '')) {
                changes.push(`${formatFieldName(key)} was removed`);
            } else {
                 changes.push(`${formatFieldName(key)} changed from ${formatValue(from)} to ${formatValue(to)}`);
            }
        }
    }

    const complexFields = ['banking_info', 'social_links'];
    const removedComplexFields = complexFields.filter(key => old_value[key] && !new_value[key]);

    if (removedComplexFields.length > 0) {
        changes.push(`${removedComplexFields.map(formatFieldName).join(' / ')} were removed`);
    }

    if (changes.length === 0) {
        return `updated ${activity.target?.ign || 'a player'}'s profile.`;
    }

    return `updated ${activity.target?.ign || 'a player'}'s profile: ${changes.join(', ')}.`;
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activity }) => {
  const date = formatDate(activity.created_at);
  const performer = activity.performer?.ign || 'System';

  let summaryText = '';

  switch (activity.action_type) {
    case 'update_player':
      summaryText = generateUpdatePlayerSummary(activity);
      break;
    default:
      summaryText = activity.action_description;
      break;
  }

  return (
    <p className="text-white text-sm">
      On {date}, <strong>Ɲ・乂{performer}</strong> {summaryText}
    </p>
  );
};