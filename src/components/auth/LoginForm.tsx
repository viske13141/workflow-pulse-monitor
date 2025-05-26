
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, User, Shield } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Predefined users for demo
  const users = {
    // HR Users
    'vishnu_@gmail.com': { role: 'HR', name: 'Vishnu', password: ')(*&^%$#@!' },
    'gayatri_@gmail.com': { role: 'HR', name: 'Gayatri', password: ')(*&^%$#@!' },
    
    // Team Leads
    'suhas.app@gmail.com': { role: 'Team Lead', name: 'Suhas', department: 'App Development', password: '!@#$%^&*()' },
    'vishnu.frontend@gmail.com': { role: 'Team Lead', name: 'Vishnu', department: 'Frontend', password: '!@#$%^&*()' },
    'samatha.cloud@gmail.com': { role: 'Team Lead', name: 'Samatha', department: 'Cloud + DB', password: '!@#$%^&*()' },
    'steev.social@gmail.com': { role: 'Team Lead', name: 'Steev', department: 'Social Media', password: '!@#$%^&*()' },
    
    // App Development Team
    'harikaappdevelopment@gmail.com': { role: 'Employee', name: 'Harika', department: 'App Development', password: '!@#$%^&' },
    'shanmukapp@gmail.com': { role: 'Employee', name: 'Shanmuk', department: 'App Development', password: '!@#$%^&' },
    'krishnaapp@gmail.com': { role: 'Employee', name: 'Krishna', department: 'App Development', password: '!@#$%^&' },
    
    // Frontend Team
    'chaitufrontend@gmail.com': { role: 'Employee', name: 'Chaitu', department: 'Frontend', password: '!@#$%^&' },
    'srustifrontend@gmail.com': { role: 'Employee', name: 'Srusti', department: 'Frontend', password: '!@#$%^&' },
    'pranavikafrontend@gmail.com': { role: 'Employee', name: 'Pranavika', department: 'Frontend', password: '!@#$%^&' },
    'sreenikafrontend@gmail.com': { role: 'Employee', name: 'Sreenika', department: 'Frontend', password: '!@#$%^&' },
    'harshithafrontend@gmail.com': { role: 'Employee', name: 'Harshitha Priya', department: 'Frontend', password: '!@#$%^&' },
    
    // Backend Team
    'sowmyabackend@gmail.com': { role: 'Employee', name: 'Sowmya', department: 'Backend', password: '!@#$%^&' },
    'ravibackend@gmail.com': { role: 'Employee', name: 'Ravi', department: 'Backend', password: '!@#$%^&' },
    'arjunbackend@gmail.com': { role: 'Employee', name: 'Arjun', department: 'Backend', password: '!@#$%^&' },
    
    // Cloud + DB Team
    'mithuncloud@gmail.com': { role: 'Employee', name: 'Mithun', department: 'Cloud + DB', password: '!@#$%^&' },
    'srneekacloud@gmail.com': { role: 'Employee', name: 'Srneeka', department: 'Cloud + DB', password: '!@#$%^&' },
    
    // Social Media Team
    'haryanksocial@gmail.com': { role: 'Employee', name: 'Haryank', department: 'Social Media', password: '!@#$%^&' },
    'davidsocial@gmail.com': { role: 'Employee', name: 'David', department: 'Social Media', password: '!@#$%^&' },
    'sakethsocial@gmail.com': { role: 'Employee', name: 'Saketh', department: 'Social Media', password: '!@#$%^&' },
    'munnasocial@gmail.com': { role: 'Employee', name: 'Munna', department: 'Social Media', password: '!@#$%^&' },
    'vamsisocial@gmail.com': { role: 'Employee', name: 'Vamsi', department: 'Social Media', password: '!@#$%^&' },
  };

  const credentialData = {
    hr: {
      title: 'HR Department',
      icon: Shield,
      color: 'bg-purple-100 border-purple-200',
      members: [
        { name: 'Vishnu', email: 'vishnu_@gmail.com', password: ')(*&^%$#@!' },
        { name: 'Gayatri', email: 'gayatri_@gmail.com', password: ')(*&^%$#@!' }
      ]
    },
    teamLeads: {
      title: 'Team Leads',
      icon: Users,
      color: 'bg-blue-100 border-blue-200',
      members: [
        { name: 'Suhas (App Dev)', email: 'suhas.app@gmail.com', password: '!@#$%^&*()' },
        { name: 'Vishnu (Frontend)', email: 'vishnu.frontend@gmail.com', password: '!@#$%^&*()' },
        { name: 'Samatha (Cloud)', email: 'samatha.cloud@gmail.com', password: '!@#$%^&*()' },
        { name: 'Steev (Social)', email: 'steev.social@gmail.com', password: '!@#$%^&*()' }
      ]
    },
    employees: {
      title: 'Team Members',
      icon: User,
      color: 'bg-green-100 border-green-200',
      departments: {
        'App Development': [
          { name: 'Harika', email: 'harikaappdevelopment@gmail.com', password: '!@#$%^&' },
          { name: 'Shanmuk', email: 'shanmukapp@gmail.com', password: '!@#$%^&' },
          { name: 'Krishna', email: 'krishnaapp@gmail.com', password: '!@#$%^&' }
        ],
        'Frontend': [
          { name: 'Chaitu', email: 'chaitufrontend@gmail.com', password: '!@#$%^&' },
          { name: 'Srusti', email: 'srustifrontend@gmail.com', password: '!@#$%^&' },
          { name: 'Pranavika', email: 'pranavikafrontend@gmail.com', password: '!@#$%^&' },
          { name: 'Sreenika', email: 'sreenikafrontend@gmail.com', password: '!@#$%^&' },
          { name: 'Harshitha Priya', email: 'harshithafrontend@gmail.com', password: '!@#$%^&' }
        ],
        'Backend': [
          { name: 'Sowmya', email: 'sowmyabackend@gmail.com', password: '!@#$%^&' },
          { name: 'Ravi', email: 'ravibackend@gmail.com', password: '!@#$%^&' },
          { name: 'Arjun', email: 'arjunbackend@gmail.com', password: '!@#$%^&' }
        ],
        'Cloud + DB': [
          { name: 'Mithun', email: 'mithuncloud@gmail.com', password: '!@#$%^&' },
          { name: 'Srneeka', email: 'srneekacloud@gmail.com', password: '!@#$%^&' }
        ],
        'Social Media': [
          { name: 'Haryank', email: 'haryanksocial@gmail.com', password: '!@#$%^&' },
          { name: 'David', email: 'davidsocial@gmail.com', password: '!@#$%^&' },
          { name: 'Saketh', email: 'sakethsocial@gmail.com', password: '!@#$%^&' },
          { name: 'Munna', email: 'munnasocial@gmail.com', password: '!@#$%^&' },
          { name: 'Vamsi', email: 'vamsisocial@gmail.com', password: '!@#$%^&' }
        ]
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users[email as keyof typeof users];
    
    if (user && user.password === password) {
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}!`,
      });
      onLogin({ ...user, email });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleCredentialClick = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Task & Attendance Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Credential Cards */}
      <div className="flex-1 p-4 space-y-4 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-center mb-4">Demo Credentials</h2>
        
        {/* HR Section */}
        <Card className={`${credentialData.hr.color}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <credentialData.hr.icon size={20} />
              {credentialData.hr.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {credentialData.hr.members.map((member, index) => (
                <div 
                  key={index}
                  className="p-2 bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleCredentialClick(member.email, member.password)}
                >
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500">Password: {member.password}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Leads Section */}
        <Card className={`${credentialData.teamLeads.color}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <credentialData.teamLeads.icon size={20} />
              {credentialData.teamLeads.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {credentialData.teamLeads.members.map((member, index) => (
                <div 
                  key={index}
                  className="p-2 bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleCredentialClick(member.email, member.password)}
                >
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500">Password: {member.password}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employees Section */}
        <Card className={`${credentialData.employees.color}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <credentialData.employees.icon size={20} />
              {credentialData.employees.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(credentialData.employees.departments).map(([dept, members]) => (
                <div key={dept}>
                  <Badge variant="outline" className="mb-2">{dept}</Badge>
                  <div className="space-y-2">
                    {members.map((member, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleCredentialClick(member.email, member.password)}
                      >
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">Password: {member.password}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
