"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus, Save, ArrowLeft, AlertTriangle, Train, Plane, Car, Navigation } from "lucide-react";
import { mockData } from "@/lib/mock-data";

// 並び替え可能なアイテムコンポーネント
function SortableItem({ id, spot }: { id: string, spot: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isTransit = spot.type === "transit";

  const getTransitIcon = (iconStr: string) => {
    switch (iconStr) {
      case "train": return <Train className="w-5 h-5 text-gray-500" />;
      case "plane": return <Plane className="w-5 h-5 text-gray-500" />;
      case "car": return <Car className="w-5 h-5 text-gray-500" />;
      default: return <Navigation className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`rounded-xl shadow-sm border p-4 mb-4 flex items-start gap-4 ${isTransit ? 'bg-gray-50/50 border-dashed border-gray-300' : 'bg-white border-gray-200'}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#1A2B4C]"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-grow space-y-2">
        <div className="flex items-center justify-between">
          <div className={`font-flight text-sm font-bold px-2 py-1 rounded ${isTransit ? 'text-gray-500 bg-gray-100' : 'text-[#00A4E5] bg-blue-50'}`}>
            {spot.time}
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {isTransit && getTransitIcon(spot.icon || "navigation")}
          <h3 className={`font-bold ${isTransit ? 'text-base text-gray-700' : 'text-lg text-[#1A2B4C]'}`}>
            {spot.name}
          </h3>
        </div>
        
        {spot.alert && (
          <div className="flex items-start gap-2 text-sm text-amber-900 bg-[#FFD166]/20 px-3 py-2 rounded-lg border border-[#FFD166]/50 mt-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-medium">{spot.alert}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ページコンポーネント
export default function EditTripPage() {
  const [items, setItems] = useState(mockData.trips[0].spots);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* ヘッダー */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-20 z-40">
        <div className="flex items-center gap-4">
          <Link href={`/trips/${mockData.trips[0].id}`} className="text-gray-500 hover:text-[#1A2B4C] transition-colors p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg md:text-xl line-clamp-1">{mockData.trips[0].title}</h1>
        </div>
        <button className="bg-[#1A2B4C] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shrink-0 shadow-sm">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">保存</span>
        </button>
      </div>

      {/* ドラッグ＆ドロップエリア */}
      <div className="bg-[#F4F5F7] p-2 md:p-6 rounded-2xl">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map(spot => (
              <SortableItem key={spot.id} id={spot.id} spot={spot} />
            ))}
          </SortableContext>
        </DndContext>

        {/* 追加ボタン */}
        <button className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-500 hover:text-[#00A4E5] hover:border-[#00A4E5] hover:bg-blue-50 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 mt-4 group">
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-bold">新しいスポットを追加する</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
          <GripVertical className="w-4 h-4" />
          ドラッグして順番を入れ替えられます
        </p>
      </div>
    </div>
  );
}
