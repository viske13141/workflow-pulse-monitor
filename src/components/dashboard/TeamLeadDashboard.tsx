
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, CheckCircle, Clock } from 'lucide-react';

interface TeamLeadDashboardProps {
  user: any;
}

const TeamLeadDashboard: React.FC<TeamLeadDashboardProps> = ({ user }) => {
  const [departmentTasks, setDepartmentTasks] = useState([
    { id: 1, title: 'Mobile App Development', assignedBy: 'HR', progress: 0, status: 'Not Started' },
    { id: 2, title: 'User Authentication Module', assignedBy: 'HR', progress: 100, status: 'Completed' },
  ]);

  const [teamTasks, setTeamTasks] = useState([
    { id: 1, title: 'Login Screen Design', assignedTo: 'Harika', progress: 85, dueDate: '2024-01-15' },
    { id: 2, title: 'API Integration', assignedTo: 'Shanmuk', progress: 60, dueDate: '2024-01-20' },
    { id: 3, title: 'Testing Module', assignedTo: 'Krishna', progress: 30, dueDate: '2024-01-25' },
  ]);

  const getTeamMembers = () => {
    const teams = {
      'App Development': ['Harika', 'Shanmuk', 'Krishna'],
      'Frontend': ['Chaitu', 'Srusti', 'Pranavika'],
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Lead Dashboard</h1>
          <p className="text-gray-600">Managing {user.department} Team</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Assign Task
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
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold">{teamTasks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold">12</p>
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
              <div className="space-y-4">
                {departmentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Assigned by: {task.assignedBy}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <Progress value={task.progress} className="w-full" />
                        </div>
                        <span className="text-sm font-medium">{task.progress}%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Split Task
                    </Button>
                  </div>
                ))}
              </div>
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
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge variant="outline">{task.assignedTo}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <Progress value={task.progress} className="w-full" />
                        </div>
                        <span className={`text-sm font-medium ${getProgressColor(task.progress)}`}>
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {getTeamMembers().map((member, index) => (
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
                        <span>Tasks: 3</span>
                        <span className="text-green-600">85% Avg</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {[
                  { employee: 'Harika', reason: 'Medical leave', days: 2, date: '2024-01-20' },
                  { employee: 'Krishna', reason: 'Personal', days: 1, date: '2024-01-22' },
                ].map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{leave.employee}</p>
                      <p className="text-sm text-gray-600">{leave.reason} • {leave.days} days • {leave.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reject</Button>
                      <Button size="sm">Forward to HR</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadDashboard;
