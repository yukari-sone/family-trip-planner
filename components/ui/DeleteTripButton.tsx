'use client';

import { Trash2 } from 'lucide-react';
import { deleteTripAction } from '@/app/actions/trip';

export function DeleteTripButton({ tripId }: { tripId: string }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (window.confirm('本当にこのプランを削除しますか？')) {
      try {
        await deleteTripAction(tripId);
      } catch (error) {
        console.error('削除に失敗しました', error);
        alert('削除に失敗しました');
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm z-10"
      title="プランを削除"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
