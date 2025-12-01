import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Search from '@mui/icons-material/Search'
import Add from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

function Students() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setStudents([
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', quizzesTaken: 5, avgScore: 85 },
          { id: 2, name: 'Bob Smith', email: 'bob@example.com', quizzesTaken: 3, avgScore: 78 },
          { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', quizzesTaken: 7, avgScore: 92 },
          { id: 4, name: 'Diana Prince', email: 'diana@example.com', quizzesTaken: 2, avgScore: 88 }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <TextField
          placeholder="Search students..."
          variant="outlined"
          size="small"
          className="search-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserAvatar />
        </div>
      </div>

      {/* Header */}
      <div className="content-header">
        <div>
          <Typography variant="h4" className="page-title">
            Students
          </Typography>
          <Typography variant="subtitle1" className="welcome-text">
            Manage and view student performance
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          className="create-btn primary"
          onClick={() => navigate('/create-quiz/step1')}
        >
          Create New Quiz
        </Button>
      </div>

      {/* Students Table */}
      <div className="students-table">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Quizzes Taken</TableCell>
                <TableCell align="right">Average Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell align="right">{student.quizzesTaken}</TableCell>
                  <TableCell align="right">{student.avgScore}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default Students
