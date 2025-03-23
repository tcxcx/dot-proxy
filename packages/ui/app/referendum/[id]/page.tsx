"use client";

import { useParams, useRouter } from 'next/navigation';
import { ReferendumVote } from '@/components/governance/referendum-vote';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ReferendumPage() {
  const params = useParams();
  const router = useRouter();
  const referendumId = parseInt(params.id as string);
  
  // Validate that referendumId is a number
  if (isNaN(referendumId)) {
    return (
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Invalid Referendum ID</h1>
        <Button variant="outline" onClick={() => router.push('/referenda')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Referenda
        </Button>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto p-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Referendum #{referendumId}</h1>
      </div>
      
      <div className="space-y-6">
        <ReferendumVote referendumId={referendumId} />
      </div>
    </main>
  );
} 