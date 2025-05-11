import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);
  const [activeTaskTab, setActiveTaskTab] = useState('pending');
  const navigate = useNavigate();
  
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const loggedInEmail = loggedInUser ? loggedInUser.email : '';

  useEffect(() => {
    // Fetch tasks and meetings assigned to the employee
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    const employeeTasks = allTasks.filter(task => 
      task.type === 'task' && task.assignedTo === loggedInEmail
    );
    setTasks(employeeTasks);
    
    const employeeMeetings = allTasks.filter(task => 
      task.type === 'meeting' && task.assignedTo.includes(loggedInEmail)
    );
    setMeetings(employeeMeetings);
    
    // Fetch employee's leave requests
    const allLeaves = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const employeeLeaves = allLeaves.filter(leave => leave.employeeEmail === loggedInEmail);
    setMyLeaves(employeeLeaves);
  }, [loggedInEmail]);

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    // Update in localStorage
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedAllTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    localStorage.setItem('tasks', JSON.stringify(updatedAllTasks));
    setTasks(updatedTasks);
    toast.success(`Task marked as ${newStatus}`);
  };

  const handleRequestLeave = () => {
    if (!leaveStartDate || !leaveEndDate) {
      toast.error('Please select start and end dates');
      return;
    }
    
    if (new Date(leaveStartDate) > new Date(leaveEndDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    if (!leaveReason) {
      toast.error('Please provide a reason for leave');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const employee = users.find(user => user.email === loggedInEmail);
    
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const newLeave = {
      id: Date.now(),
      employeeName: employee.name,
      employeeEmail: loggedInEmail,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reason: leaveReason,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    
    leaveRequests.push(newLeave);
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    setMyLeaves([...myLeaves, newLeave]);
    
    toast.success('Leave request submitted');
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveReason('');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const filteredTasks = tasks.filter(task => 
    activeTaskTab === 'all' ? true : task.status === activeTaskTab
  );

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      
      <div className="dashboard-sections">
        <section className="tasks-section">
          <div className="task-tabs">
            <button
              className={activeTaskTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveTaskTab('pending')}
            >
              Pending
            </button>
            <button
              className={activeTaskTab === 'in-progress' ? 'active' : ''}
              onClick={() => setActiveTaskTab('in-progress')}
            >
              In Progress
            </button>
            <button
              className={activeTaskTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTaskTab('completed')}
            >
              Completed
            </button>
            <button
              className={activeTaskTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTaskTab('all')}
            >
              All
            </button>
          </div>
          
          <h2>Your Tasks ({activeTaskTab})</h2>
          {filteredTasks.length > 0 ? (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <div key={task.id} className={`task-item ${task.status}`}>
                  <div className="task-header">
                    <h3>{task.description}</h3>
                    <span className={`status-badge ${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="task-deadline">
                    <strong>Due:</strong> {new Date(task.deadline).toLocaleString()}
                  </p>
                  <p className="task-created">
                    <strong>Assigned on:</strong> {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="task-actions">
                    {task.status === 'pending' && (
                      <button
                        className="start-btn"
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                      >
                        Start Task
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                        >
                          Mark Complete
                        </button>
                        <button
                          className="pause-btn"
                          onClick={() => updateTaskStatus(task.id, 'pending')}
                        >
                          Pause Task
                        </button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <button
                        className="reopen-btn"
                        onClick={() => updateTaskStatus(task.id, 'pending')}
                      >
                        Reopen Task
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No {activeTaskTab} tasks</p>
          )}
          
          <h2>Your Meetings</h2>
          {meetings.length > 0 ? (
            <div className="meetings-list">
              {meetings.map(meeting => (
                <div key={meeting.id} className="meeting-item">
                  <div className="meeting-header">
                    <h3>{meeting.description}</h3>
                    <span className="meeting-badge">Meeting</span>
                  </div>
                  <p className="meeting-time">
                    <strong>Time:</strong> {new Date(meeting.deadline).toLocaleString()}
                  </p>
                  <p className="meeting-attendees">
                    <strong>Attendees:</strong> {meeting.assignedTo.length} employees
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No meetings scheduled</p>
          )}
        </section>
        
        <section className="leave-section">
          <h2>Request Leave</h2>
          <div className="leave-form">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={leaveStartDate}
                onChange={(e) => setLeaveStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={leaveEndDate}
                onChange={(e) => setLeaveEndDate(e.target.value)}
                min={leaveStartDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Enter reason for leave..."
                rows="3"
              />
            </div>
            <button className="request-leave-btn" onClick={handleRequestLeave}>
              Submit Leave Request
            </button>
          </div>
          
          <h2>Your Leave History</h2>
          {myLeaves.length > 0 ? (
            <div className="leave-history">
              {myLeaves.map(leave => (
                <div key={leave.id} className={`leave-item ${leave.status}`}>
                  <h3>
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    <span className={`status-badge ${leave.status}`}>
                      {leave.status}
                    </span>
                  </h3>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>Requested on:</strong> {new Date(leave.requestedAt).toLocaleString()}</p>
                  {leave.processedAt && (
                    <p><strong>Processed on:</strong> {new Date(leave.processedAt).toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No leave requests submitted yet</p>
          )}
        </section>
      </div>
      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default EmployeeDashboard;