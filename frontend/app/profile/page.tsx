'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/lib/components/Sidebar';
import { getMyProfile, updateMyProfile, changePassword } from '@/lib/api';
import { useRequireAuth } from '@/lib/hooks';
import { useToast } from '@/lib/toast/ToastContext';
import { Skeleton } from '@/lib/components/Skeleton';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  createdAt: string;
};

export default function ProfilePage() {
  const { user, checked, logout } = useRequireAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    avatarUrl: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!checked) return;
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
        });
      } catch (err) {
        showToast('Unable to load your profile.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [checked]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateMyProfile(formData);
      setProfile(updated);
      setFormData({
        name: updated.name || '',
        phone: updated.phone || '',
        location: updated.location || '',
        bio: updated.bio || '',
        avatarUrl: updated.avatarUrl || '',
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to change password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  }

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar active="profile" onLogout={logout} isAdmin={user?.role === 'ADMIN'} />

      <main className="flex-1 p-4 md:p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p className="text-sm text-gray-600 mb-8">Manage your account information and keep your profile up to date.</p>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-28 rounded-full mx-auto" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : !profile ? (
          <p className="text-sm text-gray-600">Failed to load profile.</p>
        ) : (
          <>
            <div className="mb-8 flex flex-col items-center">
              <img
                src={formData.avatarUrl || 'https://placehold.co/120x120/EEEDFE/4F46E5?text=User'}
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <p className="mt-3 text-xs text-gray-500">Profile Picture</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="border-b border-gray-100 pb-4 mb-5">
                <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-600 mt-1">Update your personal details below.</p>
              </div>

              <label className="block text-sm font-medium text-gray-800 mb-1">Name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm bg-gray-50 text-gray-500"
                value={profile.email}
                disabled
              />

              <label className="block text-sm font-medium text-gray-800 mb-1">Phone</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <label className="block text-sm font-medium text-gray-800 mb-1">Location</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <label className="block text-sm font-medium text-gray-800 mb-1">Bio</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />

              <label className="block text-sm font-medium text-gray-800 mb-1">Avatar URL</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              />

              <div className="flex items-center justify-between text-xs text-gray-500 mb-5 pt-2">
                <span><strong className="text-gray-700">Role:</strong> {profile.role}</span>
                <span><strong className="text-gray-700">Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </form>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="border-b border-gray-100 pb-4 mb-5">
                <h2 className="text-sm font-bold text-gray-900">Security</h2>
                <p className="text-xs text-gray-600 mt-1">Change your account password.</p>
              </div>

              <form onSubmit={handlePasswordChange}>
                <label className="block text-sm font-medium text-gray-800 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />

                <label className="block text-sm font-medium text-gray-800 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />

                <label className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-5 text-sm"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
