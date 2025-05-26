import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Users, Clock, TrendingUp, CheckCircle, Database, Search, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import TaskAssignmentDialog from '@/components/dialogs/TaskAssignmentDialog';
import DatabaseView from '@/components/database/DatabaseView';

interface HRDashboardProps {
  user: any;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Mobile App Development', department: 'App Development', progress: 75, assignedTo: 'Team Lead' },
    { id: 2, title: 'Website Redesign', department: 'Frontend', progress: 60, assignedTo: 'Team Lead' },
    { id: 3, title: 'API Development', department: 'Backend', progress: 90, assignedTo: 'Direct Assignment' },
    { id: 4, title: 'Cloud Migration', department: 'Cloud + DB', progress: 45, assignedTo: 'Team Lead' },
  ]);

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchTermLogs, setSearchTermLogs] = useState('');
  const [searchTermTasks, setSearchTermTasks] = useState('');
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

  // Filter tasks assigned by HR
  const hrAssignedTasks = allTasks?.filter(task => 
    task['Assigned By'] === 'HR'
  ) || [];

  // Filter leave requests that are forwarded to HR
  const hrLeaveRequests = allLogs?.filter(log => 
    log['Leave Applied?'] === 'Yes' &&
    (log['Leave Status'] === 'Forwarded to HR' || log['HR Approval'] === 'Pending')
  ) || [];

  // Filter functions for search
  const filteredLogs = allLogs?.filter(log =>
    log['Employee Name']?.toLowerCase().includes(searchTermLogs.toLowerCase()) ||
    log.Department?.toLowerCase().includes(searchTermLogs.toLowerCase()) ||
    log.Date?.includes(searchTermLogs) ||
    log.Email?.toLowerCase().includes(searchTermLogs.toLowerCase())
  ) || [];

  const filteredTasks = allTasks?.filter(task =>
    task['Assigned To']?.toLowerCase().includes(searchTermTasks.toLowerCase()) ||
    task.Department?.toLowerCase().includes(searchTermTasks.toLowerCase()) ||
    task['Task ID']?.toLowerCase().includes(searchTermTasks.toLowerCase()) ||
    task.Deadline?.includes(searchTermTasks) ||
    task['Task Title']?.toLowerCase().includes(searchTermTasks.toLowerCase())
  ) || [];

  const departmentData = [
    { name: 'App Dev', tasks: 8, completed: 6 },
    { name: 'Frontend', tasks: 5, completed: 3 },
    { name: 'Backend', tasks: 12, completed: 10 },
    { name: 'Cloud', tasks: 4, completed: 2 },
    { name: 'Social', tasks: 6, completed: 4 },
  ];

  const leaveData = [
    { name: 'Approved', value: 15, color: '#10B981' },
    { name: 'Pending', value: 8, color: '#F59E0B' },
    { name: 'Rejected', value: 3, color: '#EF4444' },
  ];

  const attendanceData = [
    { day: 'Mon', checkins: 45 },
    { day: 'Tue', checkins: 52 },
    { day: 'Wed', checkins: 49 },
    { day: 'Thu', checkins: 48 },
    { day: 'Fri', checkins: 55 },
  ];

  const getDepartmentColor = (department: string) => {
    const colors = {
      'App Development': 'bg-blue-100 text-blue-800',
      'Frontend': 'bg-green-100 text-green-800',
      'Backend': 'bg-purple-100 text-purple-800',
      'Cloud + DB': 'bg-orange-100 text-orange-800',
      'Social Media': 'bg-pink-100 text-pink-800',
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleTaskAssigned = (newTask: any) => {
    setAssignedTasks(prev => [...prev, newTask]);
    refetchTasks();
    console.log('New task assigned:', newTask);
  };

  const handleApproveLeave = async (leaveRequest: any) => {
    try {
      await apiService.updateHRLeaveApproval(
        leaveRequest['Employee Name'], 
        leaveRequest.Date, 
        'Approved', 
        'Approved'
      );
      
      refetchLogs();
      
      toast({
        title: "Leave Approved",
        description: `Leave request for ${leaveRequest['Employee Name']} has been approved`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectLeave = async (leaveRequest: any) => {
    try {
      await apiService.updateHRLeaveApproval(
        leaveRequest['Employee Name'], 
        leaveRequest.Date, 
        'Rejected', 
        'Rejected'
      );
      
      refetchLogs();
      
      toast({
        title: "Leave Rejected",
        description: `Leave request for ${leaveRequest['Employee Name']} has been rejected`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsTaskDialogOpen(true)}
        >
          <Plus size={16} />
          Assign New Task
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold">47</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold">35</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
              <p className="text-2xl font-bold">{hrLeaveRequests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
              <p className="text-2xl font-bold">{hrAssignedTasks.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="assigned-tasks">HR Assigned</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="employee-logs">Employee Logs</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Tasks</CardTitle>
              <CardDescription>Overview of all assigned tasks by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge className={getDepartmentColor(task.department)}>
                          {task.department}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={task.progress} className="w-full" />
                        </div>
                        <span className="text-sm font-medium">{task.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned-tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HR Assigned Tasks</CardTitle>
              <CardDescription>Tasks assigned by HR to team leads with dates and titles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search by name, department, task ID, or deadline..."
                    value={searchTermTasks}
                    onChange={(e) => setSearchTermTasks(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                {hrAssignedTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks assigned yet.</p>
                    <p className="text-sm">Click "Assign New Task" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(searchTermTasks ? filteredTasks.filter(task => task['Assigned By'] === 'HR') : hrAssignedTasks).map((task: any) => (
                      <div key={task['Task ID']} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{task['Task Title']}</h3>
                            <Badge className={getDepartmentColor(task.Department)}>
                              {task.Department}
                            </Badge>
                            <Badge variant="outline">{task.Status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.Description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Assigned to: {task['Assigned To']}</span>
                            {task.Deadline && <span>Due: {task.Deadline}</span>}
                            <span>Assigned: {task['Assigned Date']}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex-1">
                              <Progress value={parseInt(task['Progress (%)']) || 0} className="w-full" />
                            </div>
                            <span className="text-sm font-medium">{task['Progress (%)']}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10B981" />
                    <Bar dataKey="tasks" fill="#E5E7EB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Check-in Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="checkins" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests for HR Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hrLeaveRequests.map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{leave['Employee Name']}</p>
                      <p className="text-sm text-gray-600">
                        {leave.Department} • {leave.Reason} • {leave['Leave Dates']}
                      </p>
                      <p className="text-sm text-gray-500">
                        Team Lead Status: {leave['Team Lead Approval']}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectLeave(leave)}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveLeave(leave)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
                {hrLeaveRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No pending leave requests for HR approval.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Daily Logs</CardTitle>
              <CardDescription>View and search all employee attendance logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search by name, department, or date..."
                    value={searchTermLogs}
                    onChange={(e) => setSearchTermLogs(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Check-In</TableHead>
                      <TableHead>Check-Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.slice(0, 20).map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.Date}</TableCell>
                        <TableCell>{log['Employee Name']}</TableCell>
                        <TableCell>{log.Department}</TableCell>
                        <TableCell>{log['Check-In'] || '-'}</TableCell>
                        <TableCell>{log['Check-Out'] || '-'}</TableCell>
                        <TableCell>{log['Total Hours'] || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.Status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <DatabaseView />
        </TabsContent>
      </Tabs>

      <TaskAssignmentDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onTaskAssigned={handleTaskAssigned}
      />
    </div>
  );
};

export default HRDashboard;
