
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';

interface TaskAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAssigned: (task: any) => void;
}

const teamLeads = [
  { name: 'Suhas', department: 'App Development', email: 'suhas.app@gmail.com' },
  { name: 'Vishnu', department: 'Frontend', email: 'vishnu.frontend@gmail.com' },
  { name: 'Samatha', department: 'Cloud + DB', email: 'samatha.cloud@gmail.com' },
  { name: 'Steev', department: 'Social Media', email: 'steev.social@gmail.com' },
  { name: 'Rahil', department: 'Backend', email: 'rahil.backend@gmail.com' },
];

const TaskAssignmentDialog: React.FC<TaskAssignmentDialogProps> = ({ 
  open, 
  onOpenChange, 
  onTaskAssigned 
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!taskTitle || !taskDescription || !selectedTeamLead) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedLead = teamLeads.find(lead => lead.name === selectedTeamLead);
      const taskId = 'TSK-' + Date.now();
      
      const newTask = {
        'Task ID': taskId,
        'Parent Task (from HR)': taskTitle,
        'Assigned To': selectedLead?.name || '',
        Email: selectedLead?.email || '',
        Department: selectedLead?.department || '',
        'Assigned By': 'HR',
        'Assigned Date': format(new Date(), 'yyyy-MM-dd'),
        Deadline: deadline ? format(deadline, 'yyyy-MM-dd') : '',
        'Task Title': taskTitle,
        Description: taskDescription,
        'Progress (%)': '0',
        Status: 'Assigned',
        Comments: ''
      };

      // Post to API
      await apiService.postTask(newTask);

      onTaskAssigned(newTask);
      
      toast({
        title: "Task Assigned",
        description: `Task "${taskTitle}" has been assigned to ${selectedLead?.name} (${selectedLead?.department})`,
      });

      // Reset form
      setTaskTitle('');
      setTaskDescription('');
      setSelectedTeamLead('');
      setDeadline(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: "Error",
        description: "Failed to assign task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogDescription>
            Create and assign a new task to a team lead
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Title *</label>
            <Input
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Description *</label>
            <Textarea
              placeholder="Describe the task requirements and objectives"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign to Team Lead *</label>
            <Select value={selectedTeamLead} onValueChange={setSelectedTeamLead}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team lead" />
              </SelectTrigger>
              <SelectContent>
                {teamLeads.map((lead) => (
                  <SelectItem key={lead.name} value={lead.name}>
                    {lead.name} - {lead.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Assigning...' : 'Assign Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentDialog;
