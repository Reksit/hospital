import { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Bed,
  Activity,
  Calendar,
  Plus
} from 'lucide-react';
import { hospitalApi } from '../../services/api';
import { websocketService } from '../../services/websocket';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Assignment } from '../../types/hospital';

export function DoctorDashboard() {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeShift, setActiveShift] = useState(true);
  const [shiftStartTime] = useState(new Date());

  useEffect(() => {
    loadAssignments();
    
    // Connect to WebSocket for real-time assignment updates
    const token = localStorage.getItem('accessToken');
    if (token && user) {
      websocketService.connect(token);
      websocketService.subscribeToAssignments(user.id, handleNewAssignment);
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user]);

  const loadAssignments = async () => {
    try {
      const data = await hospitalApi.getAssignments();
      // Filter assignments for current user
      const userAssignments = data.filter(a => a.staffId === user?.id);
      setAssignments(userAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAssignment = (assignment: Assignment) => {
    setAssignments(prev => [assignment, ...prev]);
  };

  const updateAssignmentStatus = (assignmentId: string, status: Assignment['status'], notes?: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId
        ? { 
            ...assignment, 
            status, 
            notes,
            completedTime: status === 'COMPLETED' ? new Date().toISOString() : assignment.completedTime
          }
        : assignment
    ));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      IN_PROGRESS: 'text-blue-600 bg-blue-100',
      COMPLETED: 'text-green-600 bg-green-100',
      CANCELLED: 'text-red-600 bg-red-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'text-green-600',
      MEDIUM: 'text-yellow-600',
      HIGH: 'text-orange-600',
      CRITICAL: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'CHECKUP':
        return <Stethoscope className="h-4 w-4" />;
      case 'MEDICATION':
        return <Activity className="h-4 w-4" />;
      case 'SURGERY':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatShiftDuration = () => {
    const now = new Date();
    const diffMs = now.getTime() - shiftStartTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const pendingAssignments = assignments.filter(a => a.status === 'PENDING');
  const inProgressAssignments = assignments.filter(a => a.status === 'IN_PROGRESS');
  const completedToday = assignments.filter(a => 
    a.status === 'COMPLETED' && 
    new Date(a.completedTime || '').toDateString() === new Date().toDateString()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading assignments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'DOCTOR' ? 'Doctor' : 'Nurse'} Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, Dr. {user?.firstName}!</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              activeShift ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {activeShift ? 'On Duty' : 'Off Duty'}
            </div>
            {activeShift && (
              <div className="text-xs text-gray-500 mt-1">
                Shift: {formatShiftDuration()}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setActiveShift(!activeShift)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeShift
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {activeShift ? 'End Shift' : 'Start Shift'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{pendingAssignments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressAssignments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{completedToday.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(assignments.map(a => a.patientId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {activeShift && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Add Patient Note</span>
            </button>
            
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Schedule Procedure</span>
            </button>
            
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-gray-900">Report Emergency</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Assignments</h3>
        </div>
        
        {assignments.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments</h3>
            <p className="text-gray-500">You have no current assignments. Enjoy the break!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {assignments
              .sort((a, b) => {
                // Sort by priority and then by scheduled time
                const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
                const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
                
                if (aPriority !== bPriority) {
                  return aPriority - bPriority;
                }
                
                return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
              })
              .map((assignment) => (
                <div key={assignment.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTaskIcon(assignment.taskType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {assignment.taskType.replace('_', ' ')}
                          </h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                            {assignment.priority} PRIORITY
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Patient #{assignment.patientId}
                          </div>
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            Bed #{assignment.bedId}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(assignment.scheduledTime).toLocaleString()}
                          </div>
                        </div>
                        
                        {assignment.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600">
                              <strong>Notes:</strong> {assignment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {assignment.status === 'PENDING' && (
                        <button
                          onClick={() => updateAssignmentStatus(assignment.id, 'IN_PROGRESS')}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      
                      {assignment.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => {
                            const notes = prompt('Add completion notes (optional):');
                            updateAssignmentStatus(assignment.id, 'COMPLETED', notes || undefined);
                          }}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      
                      {assignment.status !== 'COMPLETED' && assignment.status !== 'CANCELLED' && (
                        <button
                          onClick={() => updateAssignmentStatus(assignment.id, 'CANCELLED')}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {completedToday.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Completed Today</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {completedToday.slice(0, 5).map((assignment) => (
              <div key={assignment.id} className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {assignment.taskType.replace('_', ' ')} completed
                  </p>
                  <p className="text-xs text-gray-500">
                    Patient #{assignment.patientId} • Bed #{assignment.bedId}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {assignment.completedTime ? new Date(assignment.completedTime).toLocaleTimeString() : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);