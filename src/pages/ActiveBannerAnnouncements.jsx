import React, { useState, useEffect } from 'react';
import { Bell, Calendar, User, Megaphone } from 'lucide-react';
import { createApiClient } from '../lib/createApiClient';

function ActiveBannerAnnouncements() {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiClient = createApiClient("https://localhost:7086");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await apiClient.get('/api/Banner', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBanners(response.data || []);
            } catch (err) {
                setError('Failed to load announcements');
                console.error('Error fetching banners:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading banner announcements...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Megaphone className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-semibold text-gray-900">Active Banners</h1>
                </div>

                {banners.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-medium text-gray-900 mb-2">No Active Announcements</h2>
                        <p className="text-gray-500">For offers and updates, check back later!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {banners.map((banner) => (
                            <div
                                key={banner.bannerId}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="md:flex">
                                    {banner.imageUrl && (
                                        <div className="md:flex-shrink-0">
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                className="h-48 w-full md:w-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.pexels.com/photos/214659/pexels-photo-214659.jpeg?auto=compress&cs=tinysrgb&w=800';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            {banner.title}
                                        </h2>

                                        <p className="text-gray-600 mb-4">
                                            {banner.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <User className="w-4 h-4" />
                                            <span>Posted by {banner.createdByUserName}</span>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActiveBannerAnnouncements;
