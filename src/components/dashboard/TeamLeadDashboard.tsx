import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import TaskSplittingDialog from '@/components/dialogs/TaskSplittingDialog';

interface TeamLeadDashboardProps {
  user: any;
}

const TeamLeadDashboard: React.FC<TeamLeadDashboardProps> = ({ user }) => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskSplittingOpen, setIsTaskSplittingOpen] = useState(false);
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

  // Filter tasks assigned to this team lead
  const departmentTasks = allTasks?.filter(task => 
    task.Department === user.department && 
    task['Assigned By'] === 'HR' &&
    task['Assigned To'] === user.name
  ) || [];

  // Filter tasks assigned by this team lead to team members
  const teamTasks = allTasks?.filter(task => 
    task.Department === user.department && 
    task['Assigned By'] === 'Team Lead'
  ) || [];

  // Filter leave requests for this department
  const leaveRequests = allLogs?.filter(log => 
    log.Department === user.department && 
    log['Leave Applied?'] === 'Yes' &&
    log['Team Lead Approval'] === 'Pending'
  ) || [];

  const getTeamMembers = () => {
    const teams = {
      'App Development': ['Harika', 'Shanmuk', 'Krishna'],
      'Frontend': ['Chaitu', 'Srusti', 'Pranavika'],
      'Backend': ['Sowmya', 'Ravi', 'Arjun'],
      'Cloud + DB': ['Mithun', 'Srneeka'],
      'Social Media': ['Haryank', 'David', 'Saketh', 'Munna', 'Vamsi'],
    };
    return teams[user.department as keyof typeof teams] || [];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSplitTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskSplittingOpen(true);
  };

  const handleForwardToHR = async (leaveRequest: any) => {
    try {
      await apiService.updateLeaveStatus(
        leaveRequest['Employee Name'], 
        leaveRequest.Date, 
        'Approved', 
        'Forwarded to HR'
      );
      
      refetchLogs();
      
      toast({
        title: "Leave Forwarded",
        description: `Leave request for ${leaveRequest['Employee Name']} has been forwarded to HR`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to forward leave request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectLeave = async (leaveRequest: any) => {
    try {
      await apiService.updateLeaveStatus(
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
          <h1 className="text-3xl font-bold">Team Lead Dashboard</h1>
          <p className="text-gray-600">Managing {user.department} Team</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold">{getTeamMembers().length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Department Tasks</p>
              <p className="text-2xl font-bold">{departmentTasks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Tasks</p>
              <p className="text-2xl font-bold">{teamTasks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Leave Requests</p>
              <p className="text-2xl font-bold">{leaveRequests.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="department-tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="department-tasks">Department Tasks</TabsTrigger>
          <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>
          <TabsTrigger value="team-members">Team Members</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="department-tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks from HR</CardTitle>
              <CardDescription>Tasks assigned to your department</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTasks ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading tasks...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentTasks.map((task) => (
                    <div key={task['Task ID']} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{task['Task Title']}</h3>
                          <Badge variant={task.Status === 'Completed' ? 'default' : 'secondary'}>
                            {task.Status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.Description}</p>
                        <p className="text-sm text-gray-600">Assigned by: {task['Assigned By']}</p>
                        {task.Deadline && (
                          <p className="text-sm text-gray-600">Deadline: {task.Deadline}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1">
                            <Progress value={parseInt(task['Progress (%)']) || 0} className="w-full" />
                          </div>
                          <span className="text-sm font-medium">{task['Progress (%)']}%</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSplitTask(task)}
                      >
                        Split Task
                      </Button>
                    </div>
                  ))}
                  {departmentTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No tasks assigned from HR yet.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Task Assignments</CardTitle>
              <CardDescription>Tasks assigned to your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamTasks.map((task) => (
                  <div key={task['Task ID']} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{task['Task Title']}</h3>
                        <Badge variant="outline">{task['Assigned To']}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.Description}</p>
                      {task.Deadline && (
                        <p className="text-sm text-gray-600">Due: {task.Deadline}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <Progress value={parseInt(task['Progress (%)']) || 0} className="w-full" />
                        </div>
                        <span className={`text-sm font-medium ${getProgressColor(parseInt(task['Progress (%)']) || 0)}`}>
                          {task['Progress (%)']}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {teamTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tasks assigned to team members yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>{user.department} Team Members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTeamMembers().map((member, index) => {
                  const memberTasks = teamTasks.filter(task => task['Assigned To'] === member);
                  const avgProgress = memberTasks.length > 0 
                    ? Math.round(memberTasks.reduce((sum, task) => sum + (parseInt(task['Progress (%)']) || 0), 0) / memberTasks.length)
                    : 0;

                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{member[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{member}</p>
                          <p className="text-sm text-gray-600">{user.department}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm">
                          <span>Tasks: {memberTasks.length}</span>
                          <span className="text-green-600">{avgProgress}% Avg</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Leave Requests</CardTitle>
              <CardDescription>Manage leave requests from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{leave['Employee Name']}</p>
                      <p className="text-sm text-gray-600">
                        {leave.Reason} • {leave['Leave Dates']}
                      </p>
                      <p className="text-sm text-gray-500">Applied on: {leave.Date}</p>
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
                        onClick={() => handleForwardToHR(leave)}
                      >
                        Forward to HR
                      </Button>
                    </div>
                  </div>
                ))}
                {leaveRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No pending leave requests.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaskSplittingDialog
        open={isTaskSplittingOpen}
        onOpenChange={setIsTaskSplittingOpen}
        parentTask={selectedTask}
        department={user.department}
      />
    </div>
  );
};

export default TeamLeadDashboard;
