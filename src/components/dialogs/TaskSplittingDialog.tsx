
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';

interface TaskSplittingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentTask: any;
  department: string;
}

interface SubTask {
  id: string;
  employeeName: string;
  taskTitle: string;
  description: string;
  deadline?: Date;
}

const departmentEmployees = {
  'App Development': ['Harika', 'Shanmuk', 'Krishna'],
  'Frontend': ['Chaitu', 'Srusti', 'Pranavika'],
  'Backend': ['Sowmya', 'Ravi', 'Arjun'],
  'Cloud + DB': ['Mithun', 'Srneeka'],
  'Social Media': ['Haryank', 'David', 'Saketh', 'Munna', 'Vamsi'],
};

const TaskSplittingDialog: React.FC<TaskSplittingDialogProps> = ({ 
  open, 
  onOpenChange, 
  parentTask,
  department
}) => {
  const [subTasks, setSubTasks] = useState<SubTask[]>([
    { id: '1', employeeName: '', taskTitle: '', description: '', deadline: undefined }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addSubTask = () => {
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      employeeName: '',
      taskTitle: '',
      description: '',
      deadline: undefined
    };
    setSubTasks([...subTasks, newSubTask]);
  };

  const removeSubTask = (id: string) => {
    if (subTasks.length > 1) {
      setSubTasks(subTasks.filter(task => task.id !== id));
    }
  };

  const updateSubTask = (id: string, field: keyof SubTask, value: any) => {
    setSubTasks(subTasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleSubmit = async () => {
    // Validate all subtasks
    const validSubTasks = subTasks.filter(task => 
      task.employeeName && task.taskTitle && task.description
    );

    if (validSubTasks.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in at least one complete subtask",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Post each subtask to the API
      for (const subTask of validSubTasks) {
        const taskId = 'TSK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        
        const newTask = {
          'Task ID': taskId,
          'Parent Task (from HR)': parentTask?.title || '',
          'Assigned To': subTask.employeeName,
          Email: `${subTask.employeeName.toLowerCase()}@company.com`,
          Department: department,
          'Assigned By': 'Team Lead',
          'Assigned Date': format(new Date(), 'yyyy-MM-dd'),
          Deadline: subTask.deadline ? format(subTask.deadline, 'yyyy-MM-dd') : '',
          'Task Title': subTask.taskTitle,
          Description: subTask.description,
          'Progress (%)': '0',
          Status: 'Assigned',
          Comments: ''
        };

        await apiService.postTask(newTask);
      }

      toast({
        title: "Tasks Split Successfully",
        description: `${validSubTasks.length} subtasks have been assigned to team members`,
      });

      // Reset form
      setSubTasks([{ id: '1', employeeName: '', taskTitle: '', description: '', deadline: undefined }]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error splitting tasks:', error);
      toast({
        title: "Error",
        description: "Failed to split tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const employees = departmentEmployees[department as keyof typeof departmentEmployees] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Split Task: {parentTask?.title}</DialogTitle>
          <DialogDescription>
            Divide this task into subtasks and assign them to team members
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {subTasks.map((subTask, index) => (
            <div key={subTask.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Subtask {index + 1}</h4>
                {subTasks.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSubTask(subTask.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee *</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={subTask.employeeName}
                    onChange={(e) => updateSubTask(subTask.id, 'employeeName', e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee} value={employee}>
                        {employee}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title *</label>
                  <Input
                    placeholder="Enter subtask title"
                    value={subTask.taskTitle}
                    onChange={(e) => updateSubTask(subTask.id, 'taskTitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe the subtask"
                  value={subTask.description}
                  onChange={(e) => updateSubTask(subTask.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline (Optional)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !subTask.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {subTask.deadline ? format(subTask.deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={subTask.deadline}
                      onSelect={(date) => updateSubTask(subTask.id, 'deadline', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addSubTask}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Subtask
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Assigning...' : 'Assign Subtasks'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskSplittingDialog;
