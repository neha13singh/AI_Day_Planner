import { useState } from "react";
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';
import OpenAI from 'openai';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function Planner() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);

  async function generateSchedule() {
    if (!userInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Create a detailed day schedule based on these requirements: ${userInput}. 
                    Return the response as a JSON array where each item has 'time' and 'activity' properties. 
                    For example: [{"time": "9:00 AM", "activity": "Start work"}]`
        }],
      });

      try {
        const parsedSchedule = JSON.parse(response.choices[0].message.content);
        if (Array.isArray(parsedSchedule)) {
          setSchedule(parsedSchedule);
        } else {
          setSchedule([]);
        }
      } catch (parseError) {
        setSchedule([]);
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="planner-container">
      {/* Header Section */}
      <div className="planner-header">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          p: 2,
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)'
        }}>
          <EventNoteIcon sx={{ fontSize: 32, color: '#1565C0', mr: 2 }} />
          <Typography variant="h5" component="h2" sx={{ color: '#1565C0', fontWeight: 600 }}>
            AI Day Planner
          </Typography>
        </Box>
      </div>

      {/* Input Section */}
      <div className="input-container">
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="What's your plan for today? (e.g., 8 hours work, 1 hour exercise, lunch with friends)"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#1976D2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1565C0',
              }
            }
          }}
        />
        
        <Button 
          variant="contained" 
          onClick={generateSchedule}
          disabled={loading}
          fullWidth
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Schedule'}
        </Button>
      </div>

      {/* Schedule List */}
      {schedule && (
        <div className="schedule-list">
          {Array.isArray(schedule) ? schedule.map((item, index) => (
            <div key={index} className="schedule-item">
              <span className="time-badge">{item.time}</span>
              <div className="activity-content">{item.activity}</div>
            </div>
          )) : (
            <Typography variant="body1" sx={{ color: '#1565C0' }}>
              {schedule.toString()}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
} 