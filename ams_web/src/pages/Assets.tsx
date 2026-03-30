import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Laptop,
  Search,
  Filter,
  MoreVertical,
  Building2,
  Tag,
  ShieldCheck,
  AlertCircle,
  Plus,
  ArrowLeft,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { CreateCategoryModal } from '../components/CreateCategoryModal';
import { EditCategoryModal } from '../components/EditCategoryModal';

interface Category {
  id: string;
  name: string;
  depreciation_rate: number;
  salvage_rate: number;
}

interface Asset {
  id: string;
  name: string;
  tag_id: string;
  serial_number: string;
  status: 'IN_STOCK' | 'ASSIGNED' | 'UNDER_REPAIR' | 'MISSING' | 'DISPOSED';
  location: string;
  category?: { id: string; name: string };
  department?: { name: string };
  assigned_to?: { full_name: string };
}

export const Assets = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const isAdmin =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'SYSTEM_ADMIN' ||
    currentUser?.role === 'Admin and Finance';

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditCatModalOpen, setIsEditCatModalOpen] = useState(false);
  const [catToEdit, setCatToEdit] = useState<Category | null>(null);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [assetSearch, setAssetSearch] = useState('');

  const { data: categories, isLoading: loadingCats } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const { data: assets, isLoading: loadingAssets } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });

  // Filter assets by both selected category AND search terms (search query from URL OR local search)
  const filteredAssets = useMemo(() => {
    if (!assets) return [];

    let filtered = assets;

    // Level 2 filtering: by Category
    if (selectedCategory) {
      filtered = filtered.filter((a) => a.category?.id === selectedCategory.id);
    }

    // Search filtering (Union of global search and page local search)
    const qGlobal = searchQuery.toLowerCase().trim();
    const qLocal = assetSearch.toLowerCase().trim();

    if (qGlobal || qLocal) {
      filtered = filtered.filter(
        (asset) =>
          asset.name?.toLowerCase().includes(qGlobal || qLocal) ||
          asset.serial_number?.toLowerCase().includes(qGlobal || qLocal) ||
          asset.tag_id?.toLowerCase().includes(qGlobal || qLocal) ||
          asset.assigned_to?.full_name
            ?.toLowerCase()
            .includes(qGlobal || qLocal),
      );
    }

    return filtered;
  }, [assets, selectedCategory, searchQuery, assetSearch]);

  const categoryAssetsCount = useMemo(() => {
    const counts: Record<string, number> = {};
    assets?.forEach((asset) => {
      if (asset.category?.id) {
        counts[asset.category.id] = (counts[asset.category.id] || 0) + 1;
      }
    });
    return counts;
  }, [assets]);

  const deleteCatMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCatToDelete(null);
    },
  });

  const handleEditClick = (e: React.MouseEvent, cat: Category) => {
    e.stopPropagation();
    setCatToEdit(cat);
    setIsEditCatModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, cat: Category) => {
    e.stopPropagation();
    setCatToDelete(cat);
  };

  const getStatusStyle = (status: Asset['status']) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'ASSIGNED':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'UNDER_REPAIR':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'MISSING':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'DISPOSED':
        return 'bg-slate-50 text-slate-500 border-slate-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  if (!selectedCategory && !searchQuery) {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Asset Masterlist
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Select a category to view and manage inventory.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="bg-[#ff8000] hover:bg-[#e49f37] text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(255,128,0,0.4)] transform active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              New Category
            </button>
          )}
        </div>

        {loadingCats ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#ff8000]/30 border-t-[#ff8000] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(255,128,0,0.1)] hover:border-[#ff8000]/30 cursor-pointer transition-all group transform hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-[#ff8000] transition-colors shadow-inner">
                    <Laptop className="w-6 h-6 text-[#ff8000] group-hover:text-white transition-colors" />
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditClick(e, cat)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, cat)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {cat.name}
                </h3>
                <div className="flex gap-4 mt-2 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      Inventory
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {categoryAssetsCount[cat.id] || 0} Items
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      Depreciation
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {cat.depreciation_rate}% / yr
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ff8000] uppercase tracking-wider">
                    Explore Collection &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <CreateCategoryModal
          isOpen={isCatModalOpen}
          onClose={() => setIsCatModalOpen(false)}
        />
        <EditCategoryModal
          isOpen={isEditCatModalOpen}
          onClose={() => {
            setIsEditCatModalOpen(false);
            setCatToEdit(null);
          }}
          category={catToEdit}
        />

        {catToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setCatToDelete(null)}
            />
            <div className="relative z-10 bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 mx-auto">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">
                Delete Category?
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-6">
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-700">
                  "{catToDelete.name}"
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCatToDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCatMutation.mutate(catToDelete.id)}
                  disabled={deleteCatMutation.isPending}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  {deleteCatMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
      <div className="mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#ff8000] transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Categories
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Tag className="w-6 h-6 text-[#e49f37]" />
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {selectedCategory?.name || 'Search Results'}
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Viewing {filteredAssets.length} assets in this view.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <button className="bg-[#ff8000] hover:bg-[#e49f37] text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(255,128,0,0.4)] transform active:scale-95 transition-all flex items-center gap-2 group">
              <Laptop className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Add Asset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-white p-2 rounded-2xl shadow-sm mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={assetSearch}
            onChange={(e) => setAssetSearch(e.target.value)}
            placeholder="Search by SN, name or user..."
            className="w-full bg-transparent border-none pl-10 pr-8 py-2 text-sm focus:ring-0 outline-none font-medium text-slate-700 placeholder:text-slate-400"
          />
          {assetSearch && (
            <button
              onClick={() => setAssetSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Asset Details
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Tag / Serial
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Classification
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Assignment
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {loadingAssets && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 font-bold"
                  >
                    Synchronizing...
                  </td>
                </tr>
              )}

              {!loadingAssets && filteredAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-slate-400 font-bold"
                  >
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}

              {!loadingAssets &&
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                          <Laptop className="w-5 h-5 text-[#ff8000]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 truncate">
                            {asset.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {asset.category?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {asset.tag_id || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          {asset.serial_number}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {asset.department?.name || 'HISP Rwanda'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium italic">
                          {asset.location || 'HQ Storage'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(asset.status)}`}
                      >
                        {asset.status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {asset.assigned_to ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shadow-sm">
                            {asset.assigned_to.full_name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {asset.assigned_to.full_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-[#ff8000] rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100/50 bg-white/40 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>
            Showing {filteredAssets.length} of {assets?.length || 0} items
          </span>
        </div>
      </div>
    </div>
  );
};
