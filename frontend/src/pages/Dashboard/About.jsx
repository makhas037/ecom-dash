import React from 'react';
import { Building2, Users, Target, Award, Mail, Phone, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">About FiberOps</h1>
        <p className="text-xl text-white/90">
          Empowering businesses with intelligent analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            To revolutionize business intelligence by making advanced analytics accessible to everyone.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Target className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            To be the world's most trusted analytics platform for businesses of all sizes.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Mail size={24} />
            <div>
              <p className="text-sm text-white/80">Email</p>
              <p className="font-semibold">support@fiberops.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={24} />
            <div>
              <p className="text-sm text-white/80">Phone</p>
              <p className="font-semibold">+1-800-FIBEROPS</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin size={24} />
            <div>
              <p className="text-sm text-white/80">Location</p>
              <p className="font-semibold">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
