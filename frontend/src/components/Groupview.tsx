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
      <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 4 }}>
        <div className="font-extrabold text-center text-4xl pb-8">Group Management</div>

        <Box mb={2} textAlign="right">
          <button
            onClick={handleNavigation}
            className="rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
          >
            <span
              className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300"
            >
              Add Item
            </span>
            <span
              className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
            >
              <svg
                className="svg w-8 text-white"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </span>
          </button>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="group table">
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
              width: 500,
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
