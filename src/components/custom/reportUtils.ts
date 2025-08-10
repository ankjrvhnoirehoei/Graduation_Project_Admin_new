import { Report, UserTarget, ContentTarget } from '../../components/report/type';

type ReportMode = 'user' | 'content';

// Get report mode based on target type
export const getReportMode = (report: Report): ReportMode => {
  const target = report.target as any;
  return target.username ? 'user' : 'content';
};

// Type guards
export const isUserTarget = (target: any): target is UserTarget => {
  return target && target.username;
};

export const isContentTarget = (target: any): target is ContentTarget => {
  return target && target.type;
};

// Get target display info - handles both regular reports and target search
export const getTargetDisplayInfo = (
  report: Report, 
  useSearchTarget = false, 
  targetSearchInfo?: { target: UserTarget | ContentTarget; mode: ReportMode } | null
) => {
  // For target search results, use the stored target info
  if (useSearchTarget && targetSearchInfo) {
    const target = targetSearchInfo.target;
    if (isUserTarget(target)) {
      return {
        name: target.handleName,
        username: target.username,
        profilePic: target.profilePic,
        id: target._id,
        type: 'user' as const
      };
    } else if (isContentTarget(target)) {
      return {
        name: target.user.handleName,
        username: target.user.username,
        profilePic: target.user.profilePic,
        id: target._id,
        type: 'content' as const,
        contentType: target.type,
        media: target.media
      };
    }
  }
  
  // For regular reports, use the report's target
  if (isUserTarget(report.target)) {
    return {
      name: report.target.handleName,
      username: report.target.username,
      profilePic: report.target.profilePic,
      id: report.target._id,
      type: 'user' as const
    };
  } else if (isContentTarget(report.target)) {
    return {
      name: report.target.user.handleName,
      username: report.target.user.username,
      profilePic: report.target.user.profilePic,
      id: report.target._id,
      type: 'content' as const,
      contentType: report.target.type,
      media: report.target.media
    };
  }
  return null;
};