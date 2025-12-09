import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Eye, EyeOff, RefreshCw, UserX, Edit2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Leader, LeaderCategory, LEADER_CATEGORIES } from '../types';
import {
  fetchAllLeaders,
  addLeader,
  deleteLeader,
  toggleLeaderActive,
  updateLeader,
  reorderLeaders,
  AddLeaderParams,
} from '../lib/leadersApi';
import LeaderForm from './components/LeaderForm';

const CATEGORY_ORDER: LeaderCategory[] = ['state', 'district', 'ward', 'area'];

// Sortable Leader Card Component
interface SortableLeaderCardProps {
  leader: Leader;
  onEdit: (leader: Leader) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

function SortableLeaderCard({
  leader,
  onEdit,
  onToggleActive,
  onDelete,
  isDeleting,
  isToggling,
}: SortableLeaderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: leader.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded-lg border transition-all bg-white ${
        leader.is_active
          ? 'border-slate-200'
          : 'border-red-200 bg-red-50 opacity-60'
      } ${isDragging ? 'shadow-lg' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="p-1 rounded cursor-grab active:cursor-grabbing hover:bg-slate-100 flex-shrink-0"
      >
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={leader.image_data}
          alt={leader.name_en}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-slate-800 truncate">
          {leader.name_en}
        </h3>
        <p className="text-xs text-slate-500 truncate">
          {leader.position_en}
        </p>
      </div>

      {/* Status Badge */}
      {!leader.is_active && (
        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded flex-shrink-0">
          Hidden
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(leader)}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onToggleActive(leader.id, leader.is_active)}
          disabled={isToggling}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
          title={leader.is_active ? 'Hide' : 'Show'}
        >
          {isToggling ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : leader.is_active ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={() => onDelete(leader.id)}
          disabled={isDeleting}
          className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
          title="Delete"
        >
          {isDeleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function LeadersManager() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<LeaderCategory | 'all'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    setLoading(true);
    const data = await fetchAllLeaders();
    setLeaders(data);
    setLoading(false);
  };

  // Get leaders by category
  const getLeadersByCategory = (category: LeaderCategory) =>
    leaders.filter(l => l.category === category);

  // Filter leaders by category for display
  const filteredLeaders = filterCategory === 'all'
    ? leaders
    : leaders.filter(l => l.category === filterCategory);

  const handleDragEnd = async (event: DragEndEvent, category: LeaderCategory) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const categoryLeaders = getLeadersByCategory(category);
      const oldIndex = categoryLeaders.findIndex((l) => l.id === active.id);
      const newIndex = categoryLeaders.findIndex((l) => l.id === over.id);

      const reorderedCategoryLeaders = arrayMove(categoryLeaders, oldIndex, newIndex);

      // Update local state immediately for smooth UX
      setLeaders(prev => {
        const otherLeaders = prev.filter(l => l.category !== category);
        return [...otherLeaders, ...reorderedCategoryLeaders];
      });

      // Persist the new order to the database
      const orderedIds = reorderedCategoryLeaders.map((leader, index) => ({
        id: leader.id,
        display_order: index,
      }));

      await reorderLeaders(orderedIds);
    }
  };

  const handleAddLeader = async (data: Omit<AddLeaderParams, 'display_order' | 'is_active'>) => {
    setIsSubmitting(true);
    const result = await addLeader(data);
    setIsSubmitting(false);

    if (result.success) {
      setShowForm(false);
      loadLeaders();
    } else {
      alert(result.error || 'Failed to add leader');
    }
  };

  const handleUpdateLeader = async (data: Omit<AddLeaderParams, 'display_order' | 'is_active'>) => {
    if (!editingLeader) return;

    setIsSubmitting(true);
    const success = await updateLeader(editingLeader.id, data);
    setIsSubmitting(false);

    if (success) {
      setEditingLeader(null);
      loadLeaders();
    } else {
      alert('Failed to update leader');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leader?')) return;

    setDeletingId(id);
    const success = await deleteLeader(id);
    setDeletingId(null);

    if (success) {
      setLeaders(leaders.filter((l) => l.id !== id));
    } else {
      alert('Failed to delete leader');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    const success = await toggleLeaderActive(id, !currentActive);
    setTogglingId(null);

    if (success) {
      setLeaders(
        leaders.map((l) =>
          l.id === id ? { ...l, is_active: !currentActive } : l
        )
      );
    } else {
      alert('Failed to update leader status');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leaders</h1>
          <p className="text-slate-600 mt-1">
            Manage leaders for the public leaders page. Drag to reorder.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadLeaders}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Leader
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filterCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({leaders.length})
        </button>
        {CATEGORY_ORDER.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {LEADER_CATEGORIES[cat].en} ({getLeadersByCategory(cat).length})
          </button>
        ))}
      </div>

      {/* Add/Edit Leader Modal */}
      {(showForm || editingLeader) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingLeader ? 'Edit Leader' : 'Add Leader'}
            </h2>
            <LeaderForm
              initialData={editingLeader || undefined}
              onSubmit={editingLeader ? handleUpdateLeader : handleAddLeader}
              onCancel={() => {
                setShowForm(false);
                setEditingLeader(null);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Leaders Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
          <UserX className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No leaders yet</p>
          <p className="text-sm mt-1">Click "Add Leader" to add your first leader</p>
        </div>
      ) : filterCategory === 'all' ? (
        // Show grouped by category with drag-and-drop per category
        <div className="space-y-4">
          {CATEGORY_ORDER.map(category => {
            const categoryLeaders = getLeadersByCategory(category);
            if (categoryLeaders.length === 0) return null;

            return (
              <section key={category}>
                <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span className={`w-1 h-6 rounded-full ${
                    category === 'state'
                      ? 'bg-purple-500'
                      : category === 'district'
                      ? 'bg-blue-500'
                      : category === 'ward'
                      ? 'bg-green-500'
                      : 'bg-orange-500'
                  }`} />
                  {LEADER_CATEGORIES[category].en}
                  <span className="text-sm text-slate-400 font-normal">
                    ({categoryLeaders.length})
                  </span>
                </h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, category)}
                >
                  <SortableContext
                    items={categoryLeaders.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                      {categoryLeaders.map((leader) => (
                        <SortableLeaderCard
                          key={leader.id}
                          leader={leader}
                          onEdit={setEditingLeader}
                          onToggleActive={handleToggleActive}
                          onDelete={handleDelete}
                          isDeleting={deletingId === leader.id}
                          isToggling={togglingId === leader.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </section>
            );
          })}
        </div>
      ) : (
        // Single category view with drag-and-drop
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, filterCategory)}
        >
          <SortableContext
            items={filteredLeaders.map(l => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {filteredLeaders.map((leader) => (
                <SortableLeaderCard
                  key={leader.id}
                  leader={leader}
                  onEdit={setEditingLeader}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  isDeleting={deletingId === leader.id}
                  isToggling={togglingId === leader.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Stats */}
      {leaders.length > 0 && (
        <div className="text-sm text-slate-500 text-center">
          {leaders.filter((l) => l.is_active).length} active /{' '}
          {leaders.length} total leaders
        </div>
      )}
    </div>
  );
}
