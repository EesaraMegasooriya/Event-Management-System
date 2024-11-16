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
import axios from 'axios';

interface Group {
  _id: string;
  groupName: string;
  groupCode: string;
  status: boolean;
  groupMembers: { userId: string; userName: string }[];
  groupType: string;
}

const GroupView: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get<Group[]>('http://localhost:5001/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/groups/${id}`);
      alert('Group deleted successfully!');
      setGroups(groups.filter((group) => group._id !== id));
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete the group. Please try again.');
    }
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedGroup) return;

    try {
      const { _id, groupName, groupCode, status, groupType } = selectedGroup;
      await axios.put(`http://localhost:5001/api/groups/${_id}`, {
        groupName,
        groupCode,
        status,
        groupType,
      });
      alert('Group updated successfully!');
      setModalOpen(false);
      fetchGroups();
    } catch (error) {
      console.error('Error updating group:', error);
      alert('Failed to update the group. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Group Management
      </Typography>

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
  );
};

export default GroupView;
