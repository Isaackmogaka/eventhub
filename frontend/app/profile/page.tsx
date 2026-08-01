'use client';

import { useToast } from '@/lib/toast/ToastContext';

import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '@/lib/api';
import { useRequireAuth } from '@/lib/hooks';

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
  useRequireAuth();
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
  const [error, setError] = useState('');

  useEffect(() => {
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
        console.error(err);
        setError('Unable to load your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showToast('Password changed successfully!', 'success');

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to change password.', 'error');
      }
    }
  }

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-6">Failed to load profile.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <p className="mt-2 mb-8 text-gray-600">
        Manage your account information and keep your profile up to date.
      </p>

      <div className="mb-8 flex flex-col items-center">
        <img
          src={
            formData.avatarUrl ||
            "https://placehold.co/120x120/E5E7EB/6B7280?text=User"
          }
          alt="Profile"
          className="h-28 w-28 rounded-full border-4 border-gray-200 object-cover shadow"
        />

        <p className="mt-3 text-sm text-gray-500">
          Profile Picture
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your personal details below.
          </p>
        </div>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full rounded border p-2"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            className="w-full rounded border p-2 bg-gray-100"
            value={profile.email}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            className="w-full rounded border p-2"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            className="w-full rounded border p-2"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            className="w-full rounded border p-2"
            rows={4}
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Avatar URL</label>
          <input
            className="w-full rounded border p-2"
            value={formData.avatarUrl}
            onChange={(e) =>
              setFormData({ ...formData, avatarUrl: e.target.value })
            }
          />
        </div>

        <div className="text-sm text-gray-600">
          <strong>Role:</strong> {profile.role}
        </div>

        <div className="text-sm text-gray-600">
          <strong>Joined:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </div>

        <button
          type="submit"
          className="rounded-lg bg-brand-purple px-4 py-2 text-white text-sm font-semibold hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
        >
          Update Profile
        </button>
      </form>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Change your account password.
          </p>
        </div>

        <form
          onSubmit={handlePasswordChange}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block font-medium">
              Current Password
            </label>

            <input
              type="password"
              className="w-full rounded border p-2"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              New Password
            </label>

            <input
              type="password"
              className="w-full rounded border p-2"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              className="w-full rounded border p-2"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-brand-purple px-4 py-2 text-white text-sm font-semibold hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
          >
            Change Password
          </button>
        </form>
      </div>

    </main>
  );
}
