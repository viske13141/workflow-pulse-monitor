
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiService, EmployeeDailyLog, EmployeeTask } from '@/services/apiService';
import { RefreshCw, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DatabaseView: React.FC = () => {
  const { toast } = useToast();

  const {
    data: dailyLogs,
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['employeeDailyLogs'],
    queryFn: apiService.fetchEmployeeDailyLogs,
  });

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['employeeTasks'],
    queryFn: apiService.fetchEmployeeTasks,
  });

  const handleRefresh = () => {
    refetchLogs();
    refetchTasks();
    toast({
      title: "Data Refreshed",
      description: "Database information has been updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (logsError || tasksError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading database information</p>
              <p className="text-sm text-gray-600 mb-4">
                {logsError?.message || tasksError?.message}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Database View</h1>
            <p className="text-gray-600">Live data from Google Sheets API</p>
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="daily-logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily-logs">Employee Daily Logs</TabsTrigger>
          <TabsTrigger value="tasks">Employee Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Daily Logs</CardTitle>
              <CardDescription>
                Check-in/Check-out records and leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading daily logs...</span>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Check-In</TableHead>
                        <TableHead>Check-Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Leave Applied</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyLogs?.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.Date}</TableCell>
                          <TableCell className="font-medium">{log['Employee Name']}</TableCell>
                          <TableCell>
                            <Badge className={getDepartmentColor(log.Department)}>
                              {log.Department}
                            </Badge>
                          </TableCell>
                          <TableCell>{log['Check-In']}</TableCell>
                          <TableCell>{log['Check-Out']}</TableCell>
                          <TableCell>{log['Total Hours']}</TableCell>
                          <TableCell>{log['Leave Applied?']}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(log.Status)}>
                              {log.Status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(!dailyLogs || dailyLogs.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No daily logs found in the database.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Tasks</CardTitle>
              <CardDescription>
                Task assignments and progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTasks ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading tasks...</span>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task ID</TableHead>
                        <TableHead>Task Title</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks?.map((task, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">{task['Task ID']}</TableCell>
                          <TableCell className="font-medium">{task['Task Title']}</TableCell>
                          <TableCell>{task['Assigned To']}</TableCell>
                          <TableCell>
                            <Badge className={getDepartmentColor(task.Department)}>
                              {task.Department}
                            </Badge>
                          </TableCell>
                          <TableCell>{task['Assigned By']}</TableCell>
                          <TableCell>{task.Deadline}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-200 rounded-full h-2 flex-1">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${task['Progress (%)']}%` }}
                                />
                              </div>
                              <span className="text-sm">{task['Progress (%)']}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.Status)}>
                              {task.Status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(!tasks || tasks.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No tasks found in the database.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseView;
