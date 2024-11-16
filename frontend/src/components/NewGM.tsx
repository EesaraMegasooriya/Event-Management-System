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
import Swal from 'sweetalert2';

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch users. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!groupName || !groupCode || !groupType) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    const formattedGroupMembers = groupMembers.map((userName) => {
      const user = users.find((u) => u.userName === userName);
      return { userId: user?.userId || '', userName };
    });

    const data = {
      groupName,
      groupCode,
      status,
      groupMembers: formattedGroupMembers,
      groupType,
    };

    try {
      const response = await axios.post('http://localhost:5001/api/groups', data);
      Swal.fire({
        icon: 'success',
        title: 'Group Created',
        text: 'The group has been created successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'Failed to create group. Please try again later.',
      });
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 items-center justify-center">
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
                    onChange={(e) => setGroupMembers(e.target.value as string[])}
                    renderValue={(selected) => selected.join(', ')}
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
    </div>
  );
}

export default NewGM;
