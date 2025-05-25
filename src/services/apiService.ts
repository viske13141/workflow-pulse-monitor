
export interface EmployeeDailyLog {
  Date: string;
  'Employee Name': string;
  Email: string;
  Department: string;
  'Check-In': string;
  'Check-Out': string;
  'Total Hours': string;
  'Leave Applied?': string;
  'Leave Dates': string;
  Reason: string;
  'Leave Status': string;
  'Team Lead Approval': string;
  'HR Approval': string;
  Status: string;
}

export interface EmployeeTask {
  'Task ID': string;
  'Parent Task (from HR)': string;
  'Assigned To': string;
  Email: string;
  Department: string;
  'Assigned By': string;
  'Assigned Date': string;
  Deadline: string;
  'Task Title': string;
  Description: string;
  'Progress (%)': string;
  Status: string;
  Comments: string;
}

export const apiService = {
  // Fetch employee daily logs
  async fetchEmployeeDailyLogs(): Promise<EmployeeDailyLog[]> {
    try {
      const response = await fetch('https://sheetdb.io/api/v1/m7kpkj3860v36');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Employee Daily Logs fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching employee daily logs:', error);
      throw error;
    }
  },

  // Fetch employee tasks
  async fetchEmployeeTasks(): Promise<EmployeeTask[]> {
    try {
      const response = await fetch('https://sheetdb.io/api/v1/rszoewyjdlil6');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Employee Tasks fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching employee tasks:', error);
      throw error;
    }
  },

  // Post new daily log entry
  async postDailyLog(logData: Partial<EmployeeDailyLog>): Promise<void> {
    try {
      const response = await fetch('https://sheetdb.io/api/v1/m7kpkj3860v36', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: logData
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Daily log posted successfully');
    } catch (error) {
      console.error('Error posting daily log:', error);
      throw error;
    }
  },

  // Post new task
  async postTask(taskData: Partial<EmployeeTask>): Promise<void> {
    try {
      const response = await fetch('https://sheetdb.io/api/v1/rszoewyjdlil6', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: taskData
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Task posted successfully');
    } catch (error) {
      console.error('Error posting task:', error);
      throw error;
    }
  },

  // Update task progress
  async updateTaskProgress(taskId: string, progress: number, comments?: string): Promise<void> {
    try {
      const updateData = {
        'Progress (%)': progress.toString(),
        Status: progress === 100 ? 'Completed' : 'In Progress',
        ...(comments && { Comments: comments })
      };
      
      const response = await fetch(`https://sheetdb.io/api/v1/rszoewyjdlil6/Task ID/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Task progress updated successfully');
    } catch (error) {
      console.error('Error updating task progress:', error);
      throw error;
    }
  },

  // Post leave request
  async postLeaveRequest(leaveData: Partial<EmployeeDailyLog>): Promise<void> {
    try {
      const response = await fetch('https://sheetdb.io/api/v1/m7kpkj3860v36', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: leaveData
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Leave request posted successfully');
    } catch (error) {
      console.error('Error posting leave request:', error);
      throw error;
    }
  },

  // Update leave status (for team lead approval)
  async updateLeaveStatus(employeeName: string, leaveDate: string, teamLeadApproval: string, leaveStatus: string): Promise<void> {
    try {
      const updateData = {
        'Team Lead Approval': teamLeadApproval,
        'Leave Status': leaveStatus
      };
      
      // Note: This is a simplified approach - in a real system you'd want a better way to identify specific records
      const response = await fetch('https://sheetdb.io/api/v1/m7kpkj3860v36', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            Date: leaveDate,
            'Employee Name': employeeName,
            'Team Lead Approval': teamLeadApproval,
            'Leave Status': leaveStatus,
            Status: leaveStatus === 'Forwarded to HR' ? 'Pending HR Approval' : leaveStatus
          }
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Leave status updated successfully');
    } catch (error) {
      console.error('Error updating leave status:', error);
      throw error;
    }
  }
};
