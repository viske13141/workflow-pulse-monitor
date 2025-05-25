
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
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!taskTitle || !taskDescription || !selectedTeamLead) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedLead = teamLeads.find(lead => lead.name === selectedTeamLead);
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      assignedTo: selectedLead?.name,
      department: selectedLead?.department,
      deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
      status: 'Assigned',
      assignedBy: 'HR',
      createdAt: new Date().toISOString(),
    };

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
          <Button onClick={handleSubmit}>
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentDialog;
