
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, Calendar, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmployeeDashboardProps {
  user: any;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Login Screen Design', progress: 85, dueDate: '2024-01-15', status: 'In Progress' },
    { id: 2, title: 'User Profile Component', progress: 100, dueDate: '2024-01-10', status: 'Completed' },
    { id: 3, title: 'Navigation System', progress: 45, dueDate: '2024-01-20', status: 'In Progress' },
  ]);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState('');
  
  const { toast } = useToast();

  const handleProgressUpdate = (taskId: number, newProgress: number[]) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, progress: newProgress[0], status: newProgress[0] === 100 ? 'Completed' : 'In Progress' }
        : task
    ));
    toast({
      title: "Progress Updated",
      description: `Task progress updated to ${newProgress[0]}%`,
    });
  };

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString();
    setIsCheckedIn(true);
    setCheckInTime(now);
    toast({
      title: "Checked In",
      description: `Successfully checked in at ${now}`,
    });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    const now = new Date().toLocaleTimeString();
    toast({
      title: "Checked Out",
      description: `Successfully checked out at ${now}`,
    });
  };

  const handleLeaveRequest = () => {
    if (!leaveReason || !leaveDays) {
      toast({
        title: "Error",
        description: "Please fill in all leave request fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been sent to your team lead",
    });
    setLeaveReason('');
    setLeaveDays('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name} ({user.department})</p>
        </div>
        <div className="flex gap-2">
          {!isCheckedIn ? (
            <Button onClick={handleCheckIn} className="flex items-center gap-2">
              <LogIn size={16} />
              Check In
            </Button>
          ) : (
            <Button onClick={handleCheckOut} variant="outline" className="flex items-center gap-2">
              <LogOut size={16} />
              Check Out
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold">{tasks.filter(t => t.status !== 'Completed').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'Completed').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-2xl font-bold">{isCheckedIn ? 'In' : 'Out'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-in Time</p>
              <p className="text-sm font-bold">{checkInTime || 'Not checked in'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Request</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
              <CardDescription>Update progress on your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{task.progress}%</span>
                      </div>
                      <Slider
                        value={[task.progress]}
                        onValueChange={(value) => handleProgressUpdate(task.id, value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>Track your daily check-in and check-out times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Today's Status</p>
                    <p className="text-sm text-gray-600">
                      {isCheckedIn ? `Checked in at ${checkInTime}` : 'Not checked in today'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isCheckedIn ? (
                      <Button onClick={handleCheckIn}>Check In</Button>
                    ) : (
                      <Button onClick={handleCheckOut} variant="outline">Check Out</Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Attendance</h4>
                  {[
                    { date: '2024-01-12', checkIn: '09:15 AM', checkOut: '06:30 PM' },
                    { date: '2024-01-11', checkIn: '09:00 AM', checkOut: '06:15 PM' },
                    { date: '2024-01-10', checkIn: '08:45 AM', checkOut: '06:00 PM' },
                  ].map((record, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{record.date}</span>
                      <span className="text-sm text-gray-600">
                        {record.checkIn} - {record.checkOut}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Request</CardTitle>
              <CardDescription>Submit a leave request to your team lead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Number of Days</label>
                  <Input
                    type="number"
                    placeholder="Enter number of days"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <Textarea
                    placeholder="Enter reason for leave"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />
                </div>
                <Button onClick={handleLeaveRequest} className="w-full">
                  Submit Leave Request
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Leave History</h4>
                <div className="space-y-2">
                  {[
                    { date: '2024-01-05', days: 2, reason: 'Medical', status: 'Approved' },
                    { date: '2023-12-20', days: 5, reason: 'Vacation', status: 'Approved' },
                  ].map((leave, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{leave.date}</p>
                        <p className="text-sm text-gray-600">{leave.reason} • {leave.days} days</p>
                      </div>
                      <Badge variant={leave.status === 'Approved' ? 'default' : 'secondary'}>
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
