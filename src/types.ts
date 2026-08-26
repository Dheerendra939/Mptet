export interface Question {
  id: number;
  section: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked-for-review';

export interface PromoterProfile {
  userId: string;
  name: string;
  promoCode: string;
  upiNumber?: string;
  email?: string;
  withdrawnAmount?: number;
  commissionPercent?: number; // Active approved commission percentage (e.g. 15 for 15%)
  requestedCommissionPercent?: number; // Commission requested by promoter (e.g. 25 for 25%)
  commissionStatus?: 'pending' | 'approved' | 'rejected';
  commissionRequestedAt?: any;
  commissionApprovedAt?: any;
  commissionNote?: string;
  createdAt: any;
}

export interface WithdrawalRequest {
  id: string;
  requestId: string;
  promoterId: string;
  promoterName: string;
  amount: number;
  upiNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}
