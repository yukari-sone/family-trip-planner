"use client";

import { useState, useEffect, useTransition } from "react";
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
import { GripVertical, X, Plus, AlertTriangle, Train, Plane, Car, Navigation, Loader2, Check, Sun, Sunrise, Moon, ThumbsUp } from "lucide-react";
import { getTripSpotsAction, addTripSpotAction, deleteTripSpotAction, updateSpotOrderAction, updateTripSpotAction } from "@/app/actions/trip-spot";

// 並び替え可能なアイテムコンポーネント
function SortableItem({ id, spot, onDelete, onUpdate, isPending }: { id: string, spot: any, onDelete: (id: string) => void, onUpdate: (id: string, updates: any) => void, isPending: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    place_name: spot.place_name || "",
    start_time: spot.start_time ? spot.start_time.substring(0, 5) : "",
    day_part: spot.day_part || "", // 'morning', 'afternoon', 'evening'
    type: spot.type || "spot",
    positive_comment: spot.positive_comment || "",
    failure_alert: spot.failure_alert || "",
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isPending ? 0.5 : 1,
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

  const getDayPartIcon = (dayPart: string) => {
    switch (dayPart) {
      case "morning": return <Sunrise className="w-4 h-4 text-orange-400" />;
      case "afternoon": return <Sun className="w-4 h-4 text-yellow-500" />;
      case "evening": return <Moon className="w-4 h-4 text-indigo-400" />;
      default: return null;
    }
  };

  const getDayPartLabel = (dayPart: string) => {
    switch (dayPart) {
      case "morning": return "朝";
      case "afternoon": return "昼";
      case "evening": return "夜";
      default: return "";
    }
  };

  // 表示用の時間をフォーマット
  const displayTime = spot.start_time ? spot.start_time.substring(0, 5) : "";

  const handleSave = () => {
    // 変更があれば保存
    if (
      editData.place_name !== spot.place_name || 
      editData.start_time !== (spot.start_time ? spot.start_time.substring(0, 5) : "") ||
      editData.day_part !== (spot.day_part || "") ||
      editData.type !== spot.type ||
      editData.positive_comment !== (spot.positive_comment || "") ||
      editData.failure_alert !== (spot.failure_alert || "")
    ) {
      const updates = {
        ...editData,
        start_time: editData.start_time ? `${editData.start_time}:00` : null,
        day_part: editData.day_part || null,
        positive_comment: editData.positive_comment || null,
        failure_alert: editData.failure_alert || null,
      };
      onUpdate(id, updates);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className={`rounded-xl shadow-sm border p-4 mb-4 flex items-start gap-4 ${isTransit ? 'bg-gray-50/50 border-dashed border-gray-300' : 'bg-white border-gray-200'} ring-2 ring-[#00A4E5]`}>
        <div className="mt-2 text-gray-300 cursor-not-allowed">
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-grow space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <input 
              type="time" 
              value={editData.start_time}
              onChange={(e) => setEditData({...editData, start_time: e.target.value})}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm font-flight w-24"
            />
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setEditData({...editData, day_part: editData.day_part === 'morning' ? '' : 'morning'})}
                className={`p-1.5 rounded-md flex items-center gap-1 text-sm transition-colors ${editData.day_part === 'morning' ? 'bg-white shadow-sm font-bold text-orange-500' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                <Sunrise className="w-4 h-4" /> <span className="hidden sm:inline">朝</span>
              </button>
              <button 
                onClick={() => setEditData({...editData, day_part: editData.day_part === 'afternoon' ? '' : 'afternoon'})}
                className={`p-1.5 rounded-md flex items-center gap-1 text-sm transition-colors ${editData.day_part === 'afternoon' ? 'bg-white shadow-sm font-bold text-yellow-600' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                <Sun className="w-4 h-4" /> <span className="hidden sm:inline">昼</span>
              </button>
              <button 
                onClick={() => setEditData({...editData, day_part: editData.day_part === 'evening' ? '' : 'evening'})}
                className={`p-1.5 rounded-md flex items-center gap-1 text-sm transition-colors ${editData.day_part === 'evening' ? 'bg-white shadow-sm font-bold text-indigo-500' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                <Moon className="w-4 h-4" /> <span className="hidden sm:inline">夜</span>
              </button>
            </div>

            <select 
              value={editData.type}
              onChange={(e) => setEditData({...editData, type: e.target.value})}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm ml-auto"
            >
              <option value="spot">スポット（目的地）</option>
              <option value="transit">移動</option>
            </select>
          </div>
          
          <input 
            type="text" 
            value={editData.place_name}
            onChange={(e) => setEditData({...editData, place_name: e.target.value})}
            placeholder="場所や移動手段の名前"
            className="w-full border border-gray-300 rounded px-3 py-2 font-bold text-gray-800"
            autoFocus
          />

          <div className="space-y-2">
            <div className="relative">
              <ThumbsUp className="absolute left-3 top-2.5 w-4 h-4 text-[#00A4E5]" />
              <input 
                type="text" 
                value={editData.positive_comment}
                onChange={(e) => setEditData({...editData, positive_comment: e.target.value})}
                placeholder="おすすめポイント・良かったこと"
                className="w-full border border-blue-100 bg-blue-50/50 rounded px-3 py-2 pl-9 text-sm text-gray-700"
              />
            </div>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-2.5 w-4 h-4 text-amber-500" />
              <input 
                type="text" 
                value={editData.failure_alert}
                onChange={(e) => setEditData({...editData, failure_alert: e.target.value})}
                placeholder="注意点・失敗談・持っていくべきもの"
                className="w-full border border-amber-100 bg-amber-50/30 rounded px-3 py-2 pl-9 text-sm text-gray-700"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors"
            >
              キャンセル
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-[#00A4E5] text-white font-bold rounded hover:bg-blue-600 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Check className="w-4 h-4" /> 保存する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={`rounded-xl shadow-sm border p-4 mb-4 flex items-start gap-4 ${isTransit ? 'bg-gray-50/50 border-dashed border-gray-300' : 'bg-white border-gray-200 hover:border-blue-200 transition-colors'}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#1A2B4C]"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-grow space-y-2 cursor-pointer" onClick={() => !isPending && setIsEditing(true)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(displayTime || spot.day_part) ? (
              <div className={`flex items-center gap-1.5 font-flight text-sm font-bold px-2.5 py-1 rounded-md ${isTransit ? 'text-gray-600 bg-gray-200/70' : 'text-[#00A4E5] bg-blue-50'}`}>
                {spot.day_part && getDayPartIcon(spot.day_part)}
                {displayTime && <span>{displayTime}</span>}
                {!displayTime && spot.day_part && <span>{getDayPartLabel(spot.day_part)}</span>}
              </div>
            ) : (
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">時間未設定</div>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
            disabled={isPending}
            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 py-1">
          {isTransit && getTransitIcon(spot.icon || "navigation")}
          <h3 className={`font-bold ${isTransit ? 'text-base text-gray-700' : 'text-lg text-[#1A2B4C]'}`}>
            {spot.place_name}
          </h3>
        </div>
        
        {(spot.positive_comment || spot.failure_alert) && (
          <div className="space-y-1.5 mt-1">
            {spot.positive_comment && (
              <div className="flex items-start gap-2 text-sm text-blue-900 bg-blue-50/80 px-3 py-2 rounded-lg border border-blue-100">
                <ThumbsUp className="w-4 h-4 text-[#00A4E5] shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{spot.positive_comment}</p>
              </div>
            )}
            {spot.failure_alert && (
              <div className="flex items-start gap-2 text-sm text-amber-900 bg-[#FFD166]/10 px-3 py-2 rounded-lg border border-[#FFD166]/30">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{spot.failure_alert}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function EditTripClient({ tripId }: { tripId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // 初回ロード時にDBからスポットを取得
  useEffect(() => {
    async function loadSpots() {
      try {
        const spots = await getTripSpotsAction(tripId);
        setItems(spots);
      } catch (error) {
        console.error("Failed to load spots:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSpots();
  }, [tripId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグ＆ドロップ終了時の処理
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((i) => i.id === active.id);
        const newIndex = currentItems.findIndex((i) => i.id === over.id);
        
        const newItems = arrayMove(currentItems, oldIndex, newIndex);
        
        // サーバー側に順序の更新を依頼
        startTransition(() => {
          updateSpotOrderAction(tripId, newItems.map(item => item.id));
        });
        
        return newItems;
      });
    }
  }

  // スポット追加処理
  const handleAddSpot = () => {
    startTransition(async () => {
      try {
        const newSpot = await addTripSpotAction(tripId, items.length);
        setItems(current => [...current, newSpot]);
      } catch (error) {
        console.error("Failed to add spot:", error);
        alert("スポットの追加に失敗しました");
      }
    });
  };

  // スポット削除処理
  const handleDeleteSpot = (spotId: string) => {
    if (!confirm("このスポットを削除しますか？")) return;

    startTransition(async () => {
      try {
        await deleteTripSpotAction(spotId, tripId);
        setItems(current => current.filter(item => item.id !== spotId));
      } catch (error) {
        console.error("Failed to delete spot:", error);
        alert("スポットの削除に失敗しました");
      }
    });
  };

  // スポット更新処理
  const handleUpdateSpot = (spotId: string, updates: any) => {
    startTransition(async () => {
      try {
        const updatedSpot = await updateTripSpotAction(spotId, tripId, updates);
        setItems(current => current.map(item => item.id === spotId ? { ...item, ...updatedSpot } : item));
      } catch (error) {
        console.error("Failed to update spot:", error);
        alert("スポットの更新に失敗しました");
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500 flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-[#00A4E5]" />
      読み込み中...
    </div>;
  }

  return (
    <div className="bg-[#F4F5F7] p-2 md:p-6 rounded-2xl relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-[#1A2B4C] flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> 更新中...
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 mb-4">
          <p className="text-gray-500 font-medium">まだスポットがありません。<br/>下のボタンから追加してください。</p>
        </div>
      ) : (
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
              <SortableItem 
                key={spot.id} 
                id={spot.id} 
                spot={spot} 
                onDelete={handleDeleteSpot}
                onUpdate={handleUpdateSpot}
                isPending={isPending}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* 追加ボタン */}
      <button 
        onClick={handleAddSpot}
        disabled={isPending}
        className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-500 hover:text-[#00A4E5] hover:border-[#00A4E5] hover:bg-blue-50 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 mt-4 group disabled:opacity-50"
      >
        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold">新しいスポットを追加する</span>
      </button>

      {items.length > 1 && (
        <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
          <GripVertical className="w-4 h-4" />
          ドラッグして順番を入れ替えられます
        </p>
      )}
    </div>
  );
}
