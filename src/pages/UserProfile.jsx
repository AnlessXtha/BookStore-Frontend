import React, { useContext } from "react";
import { User, Mail, Phone, Car as IdCard, Star } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center">
            {currentUser.firstName} {currentUser.lastName}
          </h1>
          <p className="text-blue-100 text-center mt-1">
            @{currentUser.userName}
          </p>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-8">
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{currentUser.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="text-gray-800">{currentUser.contactNumber}</p>
              </div>
            </div>

            {/* Member ID */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <IdCard size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Membership ID</p>
                <p className="text-gray-800">
                  {currentUser.membershipId || "Not assigned"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Star size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-gray-800">{currentUser.roles.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
