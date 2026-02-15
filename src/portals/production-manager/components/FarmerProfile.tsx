import { useState } from 'react';
import { X, Edit2, Trash2, User, Phone, Mail, MapPin, Leaf, Box, Calendar } from 'lucide-react';
import { Farmer } from '../types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface FarmerProfileProps {
  farmer: Farmer;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const FarmerProfile = ({ farmer, onClose, onUpdate, onDelete }: FarmerProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState(farmer);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('farmers')
        .update({
          full_name: editData.full_name,
          cooperative_name: editData.cooperative_name || null,
          district: editData.district,
          sector: editData.sector,
          produce_types: editData.produce_types,
          farm_size_hectares: editData.farm_size_hectares,
          production_capacity_tons: editData.production_capacity_tons,
          phone: editData.phone,
          email: editData.email || null,
          status: editData.status,
        })
        .eq('id', farmer.id);

      if (error) throw error;

      onUpdate();
      setIsEditing(false);
    } catch (error: any) {
      alert('Error updating farmer: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this farmer? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('farmers').delete().eq('id', farmer.id);

      if (error) throw error;

      onDelete();
    } catch (error: any) {
      alert('Error deleting farmer: ' + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {farmer.photo_url ? (
                <img src={farmer.photo_url} alt={farmer.full_name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="text-white" size={32} strokeWidth={2} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                ) : (
                  farmer.full_name
                )}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {farmer.cooperative_name || 'Independent Farmer'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-all">
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#2E7D32] mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Phone size={16} />
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#222222]">{farmer.phone}</p>
                )}
              </div>
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#222222]">{farmer.email || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-[#2E7D32] mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <MapPin size={16} />
              Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">District</p>
                <p className="text-sm font-medium text-[#222222]">{farmer.district}</p>
              </div>
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Sector</p>
                <p className="text-sm font-medium text-[#222222]">{farmer.sector}</p>
              </div>
            </div>
          </div>

          {/* Produce Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#2E7D32] mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Leaf size={16} />
              Produce Information
            </h3>
            <div className="bg-[#F9FCFA] p-4 rounded-lg mb-4">
              <p className="text-xs text-[#6B7280] mb-2">Produce Types</p>
              <div className="flex flex-wrap gap-2">
                {farmer.produce_types.map((produce) => (
                  <span
                    key={produce}
                    className="px-3 py-1 bg-[#E9F7EF] text-[#2E7D32] rounded-full text-xs font-medium"
                  >
                    {produce}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Farm Size</p>
                <p className="text-sm font-medium text-[#222222]">{farmer.farm_size_hectares} hectares</p>
              </div>
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Production Capacity</p>
                <p className="text-sm font-medium text-[#222222]">{farmer.production_capacity_tons} tons/season</p>
              </div>
            </div>
          </div>

          {/* Status & Dates */}
          <div>
            <h3 className="text-sm font-semibold text-[#2E7D32] mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Calendar size={16} />
              Record Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Status</p>
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium ${farmer.status === 'active' ? 'text-[#4CAF50]' : 'text-gray-500'
                      }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${farmer.status === 'active' ? 'bg-[#4CAF50]' : 'bg-gray-400'
                        }`}
                    ></span>
                    {farmer.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Registered</p>
                <p className="text-sm font-medium text-[#222222]">
                  {new Date(farmer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-[#F9FCFA] p-4 rounded-lg">
                <p className="text-xs text-[#6B7280] mb-1">Last Updated</p>
                <p className="text-sm font-medium text-[#222222]">
                  {new Date(farmer.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 p-6 flex gap-3 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-all font-medium text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditData(farmer);
                  setIsEditing(false);
                }}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-[#37474F] rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-all font-medium text-sm"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
