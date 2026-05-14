'use client';

// ===========================================
// EZRA PORTAL - Campaign Edit Page
// Redirects to the create/edit wizard with editId param
// ===========================================

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  useEffect(() => {
    router.replace(`/app/exponential/campaigns/new?editId=${campaignId}`);
  }, [campaignId, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse text-surface-500">Loading editor...</div>
    </div>
  );
}
