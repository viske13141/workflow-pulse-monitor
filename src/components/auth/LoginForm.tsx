
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
    
    // Employees
    'harikaappdevelopment@gmail.com': { role: 'Employee', name: 'Harika', department: 'App Development', password: '!@#$%^&' },
    'chaitufrontend@gmail.com': { role: 'Employee', name: 'Chaitu', department: 'Frontend', password: '!@#$%^&' },
    'sowmyabackend@gmail.com': { role: 'Employee', name: 'Sowmya', department: 'Backend', password: '!@#$%^&' },
    'mithuncloud@gmail.com': { role: 'Employee', name: 'Mithun', department: 'Cloud + DB', password: '!@#$%^&' },
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p><strong>HR:</strong> vishnu_@gmail.com</p>
              <p><strong>Team Lead:</strong> suhas.app@gmail.com</p>
              <p><strong>Employee:</strong> harikaappdevelopment@gmail.com</p>
              <p className="text-xs text-gray-500">Check console for all passwords</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
