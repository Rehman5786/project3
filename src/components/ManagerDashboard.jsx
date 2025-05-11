import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
  const [taskType, setTaskType] = useState('task');
  const [taskDescription, setTaskDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeLeaveTab, setActiveLeaveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all employees
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const employeeList = users.filter(user => user.role === 'employee');
    setEmployees(employeeList);
    
    // Fetch leave requests
    refreshLeaveRequests();
  }, []);

  const refreshLeaveRequests = () => {
    const leaves = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    setLeaveRequests(leaves);
  };

  const handleAssignTask = () => {
    if (taskType === 'task' && !assignedTo) {
      toast.error('Please select an employee for the task');
      return;
    }

    if (taskType === 'meeting' && meetingAttendees.length === 0) {
      toast.error('Please select at least one attendee for the meeting');
      return;
    }

    if (!taskDescription || !deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = {
      id: Date.now(),
      type: taskType,
      description: taskDescription,
      deadline,
      status: 'pending',
      assignedTo: taskType === 'task' ? assignedTo : meetingAttendees,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    toast.success(taskType === 'task' ? 'Task assigned successfully!' : 'Meeting scheduled successfully!');
    resetForm();
  };

  const handleLeaveAction = (leaveId, action) => {
    const updatedLeaves = leaveRequests.map(leave => {
      if (leave.id === leaveId) {
        return { ...leave, status: action, processedAt: new Date().toISOString() };
      }
      return leave;
    });
    
    localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves));
    refreshLeaveRequests();
    toast.success(`Leave ${action} successfully`);
  };

  const resetForm = () => {
    setTaskDescription('');
    setDeadline('');
    setAssignedTo('');
    setMeetingAttendees([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const toggleEmployeeSelection = (email) => {
    if (meetingAttendees.includes(email)) {
      setMeetingAttendees(meetingAttendees.filter(e => e !== email));
    } else {
      setMeetingAttendees([...meetingAttendees, email]);
    }
  };

  const filteredLeaveRequests = leaveRequests.filter(leave => 
    activeLeaveTab === 'all' ? true : leave.status === activeLeaveTab
  );

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      
      <div className="dashboard-sections">
        <section className="assign-task-section">
          <h2>{taskType === 'task' ? 'Assign Task' : 'Schedule Meeting'}</h2>
          
          <div className="task-type-toggle">
            <button
              className={taskType === 'task' ? 'active' : ''}
              onClick={() => setTaskType('task')}
            >
              Task Assignment
            </button>
            <button
              className={taskType === 'meeting' ? 'active' : ''}
              onClick={() => setTaskType('meeting')}
            >
              Meeting
            </button>
          </div>
          
          <div className="form-group">
            <label>
              {taskType === 'task' ? 'Task Description' : 'Meeting Agenda'}
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder={taskType === 'task' ? 'Enter task details...' : 'Enter meeting agenda...'}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Deadline/Time</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          {taskType === 'task' ? (
            <div className="form-group">
              <label>Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.email} value={employee.email}>
                    {employee.name} ({employee.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Select Attendees</label>
              <div className="attendees-list">
                {employees.map(employee => (
                  <div key={employee.email} className="attendee-item">
                    <input
                      type="checkbox"
                      id={`attendee-${employee.email}`}
                      checked={meetingAttendees.includes(employee.email)}
                      onChange={() => toggleEmployeeSelection(employee.email)}
                    />
                    <label htmlFor={`attendee-${employee.email}`}>
                      {employee.name} ({employee.email})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button className="assign-button" onClick={handleAssignTask}>
            {taskType === 'task' ? 'Assign Task' : 'Schedule Meeting'}
          </button>
        </section>
        
        <section className="leave-requests-section">
          <div className="leave-tabs">
            <button
              className={activeLeaveTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveLeaveTab('pending')}
            >
              Pending
            </button>
            <button
              className={activeLeaveTab === 'approved' ? 'active' : ''}
              onClick={() => setActiveLeaveTab('approved')}
            >
              Approved
            </button>
            <button
              className={activeLeaveTab === 'rejected' ? 'active' : ''}
              onClick={() => setActiveLeaveTab('rejected')}
            >
              Rejected
            </button>
            <button
              className={activeLeaveTab === 'all' ? 'active' : ''}
              onClick={() => setActiveLeaveTab('all')}
            >
              All
            </button>
          </div>
          
          <h2>Leave Requests ({activeLeaveTab})</h2>
          {filteredLeaveRequests.length > 0 ? (
            <div className="leave-requests-list">
              {filteredLeaveRequests.map(leave => (
                <div key={leave.id} className="leave-request">
                  <div className="leave-info">
                    <h3>{leave.employeeName} ({leave.employeeEmail})</h3>
                    <p><strong>Period:</strong> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> {leave.reason}</p>
                    <p><strong>Status:</strong> <span className={`status-${leave.status}`}>{leave.status}</span></p>
                    <p><strong>Requested on:</strong> {new Date(leave.requestedAt).toLocaleString()}</p>
                    {leave.processedAt && (
                      <p><strong>Processed on:</strong> {new Date(leave.processedAt).toLocaleString()}</p>
                    )}
                  </div>
                  {leave.status === 'pending' && (
                    <div className="leave-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => handleLeaveAction(leave.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleLeaveAction(leave.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No {activeLeaveTab} leave requests</p>
          )}
        </section>
      </div>
      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default ManagerDashboard;