
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, Calendar, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { format } from 'date-fns';

interface EmployeeDashboardProps {
  user: any;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState('');
  const [leaveFromDate, setLeaveFromDate] = useState('');
  const [leaveToDate, setLeaveToDate] = useState('');
  
  const { toast } = useToast();

  const {
    data: allTasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['employeeTasks'],
    queryFn: apiService.fetchEmployeeTasks,
  });

  const {
    data: allLogs,
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['employeeDailyLogs'],
    queryFn: apiService.fetchEmployeeDailyLogs,
  });

  // Filter tasks assigned to this employee
  const myTasks = allTasks?.filter(task => 
    task['Assigned To'] === user.name
  ) || [];

  // Filter leave history for this employee
  const myLeaveHistory = allLogs?.filter(log => 
    log['Employee Name'] === user.name && 
    log['Leave Applied?'] === 'Yes'
  ) || [];

  const handleProgressUpdate = async (taskId: string, newProgress: number[]) => {
    try {
      await apiService.updateTaskProgress(taskId, newProgress[0]);
      refetchTasks();
      toast({
        title: "Progress Updated",
        description: `Task progress updated to ${newProgress[0]}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    try {
      const logData = {
        Date: format(now, 'yyyy-MM-dd'),
        'Employee Name': user.name,
        Email: user.email,
        Department: user.department,
        'Check-In': timeString,
        'Check-Out': '',
        'Total Hours': '',
        'Leave Applied?': 'No',
        'Leave Dates': '',
        Reason: '',
        'Leave Status': '',
        'Team Lead Approval': '',
        'HR Approval': '',
        Status: 'Checked In'
      };

      await apiService.postDailyLog(logData);
      setIsCheckedIn(true);
      setCheckInTime(timeString);
      refetchLogs();
      
      toast({
        title: "Checked In",
        description: `Successfully checked in at ${timeString}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    try {
      // Find today's log and update it
      const today = format(now, 'yyyy-MM-dd');
      const todayLog = allLogs?.find(log => 
        log['Employee Name'] === user.name && 
        log.Date === today &&
        log['Check-In'] && !log['Check-Out']
      );

      if (todayLog) {
        // Calculate total hours
        const checkInTime = new Date(`${today} ${todayLog['Check-In']}`);
        const checkOutTime = new Date(`${today} ${timeString}`);
        const totalHours = ((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)).toFixed(2);

        const updateData = {
          'Check-Out': timeString,
          'Total Hours': totalHours,
          Status: 'Checked Out'
        };

        // Note: This would need a proper update endpoint for the specific log entry
        // For now, we'll post a new entry
        const logData = {
          ...todayLog,
          'Check-Out': timeString,
          'Total Hours': totalHours,
          Status: 'Checked Out'
        };

        await apiService.postDailyLog(logData);
        refetchLogs();
      }

      setIsCheckedIn(false);
      toast({
        title: "Checked Out",
        description: `Successfully checked out at ${timeString}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveRequest = async () => {
    if (!leaveReason || !leaveDays || !leaveFromDate || !leaveToDate) {
      toast({
        title: "Error",
        description: "Please fill in all leave request fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const logData = {
        Date: format(new Date(), 'yyyy-MM-dd'),
        'Employee Name': user.name,
        Email: user.email,
        Department: user.department,
        'Check-In': '',
        'Check-Out': '',
        'Total Hours': '',
        'Leave Applied?': 'Yes',
        'Leave Dates': `${leaveFromDate} to ${leaveToDate}`,
        Reason: leaveReason,
        'Leave Status': 'Pending',
        'Team Lead Approval': 'Pending',
        'HR Approval': 'Pending',
        Status: 'Leave Request'
      };

      await apiService.postLeaveRequest(logData);
      refetchLogs();
      
      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been sent to your team lead",
      });
      setLeaveReason('');
      setLeaveDays('');
      setLeaveFromDate('');
      setLeaveToDate('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    refetchTasks();
    refetchLogs();
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name} ({user.department})</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
              <p className="text-2xl font-bold">{myTasks.filter(t => t.Status !== 'Completed').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{myTasks.filter(t => t.Status === 'Completed').length}</p>
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
              {isLoadingTasks ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading tasks...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {myTasks.map((task) => (
                    <div key={task['Task ID']} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{task['Task Title']}</h3>
                          <p className="text-sm text-gray-600 mb-1">{task.Description}</p>
                          <p className="text-sm text-gray-600">Assigned by: {task['Assigned By']}</p>
                          {task.Deadline && (
                            <p className="text-sm text-gray-600">Due: {task.Deadline}</p>
                          )}
                        </div>
                        <Badge className={getStatusColor(task.Status)}>
                          {task.Status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{task['Progress (%)']}%</span>
                        </div>
                        <Slider
                          value={[parseInt(task['Progress (%)']) || 0]}
                          onValueChange={(value) => handleProgressUpdate(task['Task ID'], value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                  {myTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No tasks assigned yet.
                    </div>
                  )}
                </div>
              )}
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
                  {allLogs?.filter(log => 
                    log['Employee Name'] === user.name && 
                    log['Check-In'] && 
                    log.Status !== 'Leave Request'
                  ).slice(0, 5).map((record, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{record.Date}</span>
                      <span className="text-sm text-gray-600">
                        {record['Check-In']} - {record['Check-Out'] || 'In Progress'}
                        {record['Total Hours'] && ` (${record['Total Hours']} hrs)`}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From Date</label>
                    <Input
                      type="date"
                      value={leaveFromDate}
                      onChange={(e) => setLeaveFromDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">To Date</label>
                    <Input
                      type="date"
                      value={leaveToDate}
                      onChange={(e) => setLeaveToDate(e.target.value)}
                    />
                  </div>
                </div>
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
                  {myLeaveHistory.map((leave, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{leave['Leave Dates']}</p>
                        <p className="text-sm text-gray-600">{leave.Reason}</p>
                      </div>
                      <Badge variant={leave['Leave Status'] === 'Approved' ? 'default' : 'secondary'}>
                        {leave['Leave Status']}
                      </Badge>
                    </div>
                  ))}
                  {myLeaveHistory.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No leave history found.
                    </div>
                  )}
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
