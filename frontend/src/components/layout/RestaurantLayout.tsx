import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ChefHat, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RestaurantLayout: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Redirect if not restaurant owner
    if (!user || user.role !== 'restaurant') {
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/');
    };

    const navLinks = [
        { to: '/restaurant-dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/restaurant-dashboard/orders', icon: Package, label: 'Orders' },
        { to: '/restaurant-dashboard/menu', icon: ChefHat, label: 'Menu' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-200 border-r border-white/10 p-6 hidden lg:block">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold gradient-text mb-1">🍔 HalkaBite</h2>
                    <p className="text-sm text-white/60">Restaurant Dashboard</p>
                </div>

                <nav className="space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                ${isActive
                                    ? 'bg-primary-500/20 text-primary-400 font-medium'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }
              `}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-white/60 hover:bg-red-500/10 hover:text-red-400 w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Top Bar */}
                <header className="bg-dark-200 border-b border-white/10 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold">Welcome back, {user.name}!</h1>
                            <p className="text-sm text-white/60">Manage your restaurant efficiently</p>
                        </div>

                        {/* Mobile Menu - Show dropdown on mobile */}
                        <div className="lg:hidden">
                            <button className="btn btn-outline">Menu</button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RestaurantLayout;
