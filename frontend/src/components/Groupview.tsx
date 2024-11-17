import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface User {
  userId: string;
  userName: string;
}

interface Group {
  _id: string;
  groupName: string;
  groupCode: string;
  status: boolean;
  groupMembers: { userId: string; userName: string }[];
  groupType: string;
}

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://em-events-802d77926c0b.herokuapp.com';

const GroupView: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screens

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get<Group[]>(`${API_BASE_URL}/api/groups`);
      setGroups(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch groups. Please try again later.',
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch users. Please try again later.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/groups/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The group has been deleted.',
      });
      setGroups(groups.filter((group) => group._id !== id));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete the group. Please try again.',
      });
    }
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedGroup) return;

    try {
      const updatedGroup = {
        groupName: selectedGroup.groupName,
        groupCode: selectedGroup.groupCode,
        status: selectedGroup.status,
        groupType: selectedGroup.groupType,
        groupMembers: selectedGroup.groupMembers,
      };

      await axios.put(`${API_BASE_URL}/api/groups/${selectedGroup._id}`, updatedGroup);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'The group has been updated successfully.',
      });
      setModalOpen(false);
      fetchGroups();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update the group. Please try again.',
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGroup(null);
  };

  const handleUserChange = (selectedUserIds: string[]) => {
    const updatedGroupMembers = selectedUserIds
      .map((userId) => {
        const user = users.find((u) => u.userId === userId);
        return user ? { userId: user.userId, userName: user.userName } : null;
      })
      .filter(Boolean) as { userId: string; userName: string }[];
    setSelectedGroup((prev) => prev && { ...prev, groupMembers: updatedGroupMembers });
  };

  const handleNavigation = () => {
    navigate('/add-group'); // Navigate to the add group page
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 items-center justify-center text-white">
      <Box
        sx={{
          maxWidth: isMobile ? '95%' : '1000px',
          mx: 'auto',
          p: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Group Management
        </Typography>

        <Box mb={2} textAlign="right">
          <Button
            variant="contained"
            color="success"
            onClick={handleNavigation}
            sx={{ borderRadius: 2 }}
          >
            Add Group
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 2 }}>
          <Table aria-label="group table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Group Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Group Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Group Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group._id}>
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>{group.groupCode}</TableCell>
                  <TableCell>{group.status ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{group.groupType}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(group)}>
                      <EditIcon /> Edit
                    </Button>
                    <Button color="error" onClick={() => handleDelete(group._id)}>
                      <DeleteIcon /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for Editing */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '90%' : 500,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {selectedGroup && (
              <>
                <Typography variant="h6" gutterBottom>
                  Edit Group
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Name"
                      value={selectedGroup.groupName}
                      onChange={(e) =>
                        setSelectedGroup({ ...selectedGroup, groupName: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Code"
                      value={selectedGroup.groupCode}
                      onChange={(e) =>
                        setSelectedGroup({ ...selectedGroup, groupCode: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Group Type</InputLabel>
                      <Select
                        value={selectedGroup.groupType}
                        onChange={(e) =>
                          setSelectedGroup({ ...selectedGroup, groupType: e.target.value })
                        }
                      >
                        <MenuItem value="Corporate">Corporate</MenuItem>
                        <MenuItem value="Private">Private</MenuItem>
                        <MenuItem value="Public">Public</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Select Members</InputLabel>
                      <Select
                        multiple
                        value={selectedGroup.groupMembers.map((member) => member.userId)}
                        onChange={(e) => handleUserChange(e.target.value as string[])}
                        renderValue={(selected) =>
                          selected
                            .map((id) => users.find((user) => user.userId === id)?.userName)
                            .join(', ')
                        }
                      >
                        {users.map((user) => (
                          <MenuItem key={user.userId} value={user.userId}>
                            {user.userName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedGroup.status}
                          onChange={(e) =>
                            setSelectedGroup({ ...selectedGroup, status: e.target.checked })
                          }
                        />
                      }
                      label="Status"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" onClick={handleSave}>
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default GroupView;
