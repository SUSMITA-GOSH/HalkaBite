import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Loader } from 'lucide-react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } from '../../store/api/categoryApi';
import { toast } from 'react-hot-toast';
import type { Category } from '../../types';

const CategoriesPage: React.FC = () => {
    const { data: categoriesData, isLoading: isFetching } = useGetCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        slug: '',
    });

    const categories = categoriesData?.data || [];

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingId(category._id);
            setFormData({
                name: category.name,
                description: category.description || '',
                image: category.image || '',
                slug: category.slug || '',
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                image: '',
                slug: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            image: '',
            slug: '',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        const slug = formData.slug || generateSlug(formData.name);
        const payload = {
            ...formData,
            slug,
            isActive: true,
        };

        try {
            if (editingId) {
                await updateCategory({
                    id: editingId,
                    data: payload,
                }).unwrap();
                toast.success('Category updated successfully');
            } else {
                await createCategory(payload).unwrap();
                toast.success('Category created successfully');
            }
            handleCloseModal();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to save category';
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await deleteCategory(id).unwrap();
            toast.success('Category deleted successfully');
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to delete category';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-white/60">Manage food categories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            {/* Categories List */}
            <div className="grid gap-4">
                {isFetching ? (
                    <div className="text-center py-12">
                        <Loader className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12 card p-8">
                        <p className="text-white/60 mb-4">No categories found</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn btn-primary"
                        >
                            Create First Category
                        </button>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Slug</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {category.image && (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                )}
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/60 text-sm">{category.slug}</td>
                                        <td className="px-6 py-4 text-white/60 text-sm truncate max-w-xs">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors text-primary-400"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    disabled={isDeleting}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 disabled:opacity-50"
                                                >
                                                    {isDeleting ? (
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark-200 rounded-2xl w-full max-w-md border border-white/10">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {editingId ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60">Category Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Burgers"
                                    className="input w-full"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="e.g. burgers (auto-generated if empty)"
                                    className="input w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of the category..."
                                    className="input w-full h-20 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="input w-full"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="btn btn-primary"
                                >
                                    {isCreating || isUpdating ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
