import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUpdateUserMutation } from '../../store/api/adminApi';
import type { User } from '../../types';
import { toast } from 'react-hot-toast';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: 'user' | 'admin' | 'restaurant';
        isVerified: boolean;
    }>({
        name: '',
        email: '',
        role: 'user',
        isVerified: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser({
                id: user._id,
                data: formData,
            }).unwrap();
            toast.success('User updated successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-200 rounded-2xl w-full max-w-md border border-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Edit User</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input w-full"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="restaurant">Restaurant</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isVerified"
                            id="isVerified"
                            checked={formData.isVerified}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor="isVerified" className="text-sm">Verified User</label>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
