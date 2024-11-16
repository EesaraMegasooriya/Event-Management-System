import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface User {
  userId: string;
  userName: string;
}

function NewGM(): React.ReactElement {
  const [groupName, setGroupName] = useState<string>('');
  const [groupCode, setGroupCode] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupType, setGroupType] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]); // State for fetched users
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users'); // Replace with your backend endpoint
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!groupName || !groupCode || !groupType) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Log the current value of `status`
    console.log('Current status value:', status);
  
    const formattedGroupMembers = groupMembers.map((userName) => {
      const user = users.find((u) => u.userName === userName);
      return { userId: user?.userId || '', userName };
    });
  
    const data = {
      groupName,
      groupCode,
      status, // Pass the exact value of `status` from the state
      groupMembers: formattedGroupMembers,
      groupType,
    };
  
    console.log('Sending data:', data);
  
    try {
      const response = await axios.post('http://localhost:5001/api/groups', data);
      console.log('Group created successfully:', response.data);
      alert('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };
  

  return (
    <div className="mt-8">
      <Box sx={{ maxWidth: 500, mx: 'auto', p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Add New Group
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">Group Name</Typography>
            <TextField
              fullWidth
              label="Enter Group Name"
              variant="outlined"
              size="small"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">Group Code</Typography>
            <TextField
              fullWidth
              label="Enter Group Code"
              variant="outlined"
              size="small"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
            <Switch
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">Add Group Members</Typography>
            <FormControl fullWidth>
              <InputLabel>Select Members</InputLabel>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Select
                  multiple
                  value={groupMembers}
                  onChange={(e) => setGroupMembers(e.target.value as string[])} // Store selected user names
                  renderValue={(selected) => selected.join(', ')} // Show selected names
                >
                  {users.map((user) => (
                    <MenuItem key={user.userId} value={user.userName}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">Group Type</Typography>
            <FormControl fullWidth>
              <InputLabel>Select Group Type</InputLabel>
              <Select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
              >
                <MenuItem value="Corporate">Corporate</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
                <MenuItem value="Public">Public</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default NewGM;
