
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';

interface TaskUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
  onTaskUpdated: () => void;
}

const TaskUpdateDialog: React.FC<TaskUpdateDialogProps> = ({ 
  open, 
  onOpenChange, 
  task,
  onTaskUpdated 
}) => {
  const [progress, setProgress] = useState([parseInt(task?.['Progress (%)']) || 0]);
  const [comments, setComments] = useState(task?.Comments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!task) return;

    setIsSubmitting(true);
    
    try {
      await apiService.updateTaskProgress(task['Task ID'], progress[0], comments);
      
      onTaskUpdated();
      
      toast({
        title: "Task Updated",
        description: `Progress updated to ${progress[0]}%`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Task Progress</DialogTitle>
          <DialogDescription>
            Update your progress on: {task['Task Title']}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{task.Description}</p>
            {task.Deadline && (
              <p className="text-sm text-gray-600">Deadline: {task.Deadline}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Progress</label>
              <span className="text-sm">{progress[0]}%</span>
            </div>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Comments (Optional)</label>
            <Textarea
              placeholder="Add any comments about your progress"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Progress'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskUpdateDialog;
