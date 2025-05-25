
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import HRDashboard from '@/components/dashboard/HRDashboard';
import TeamLeadDashboard from '@/components/dashboard/TeamLeadDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';
import Header from '@/components/layout/Header';

const Index = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'HR':
        return <HRDashboard user={user} />;
      case 'Team Lead':
        return <TeamLeadDashboard user={user} />;
      case 'Employee':
        return <EmployeeDashboard user={user} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;
