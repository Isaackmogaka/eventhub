'use client';

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

  const [profile, setProfile] = useState<Profile | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    avatarUrl: '',
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

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-6">Failed to load profile.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border p-6 shadow-sm"
      >
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
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </main>
  );
}
