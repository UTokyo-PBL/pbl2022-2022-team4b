import { Scheduler } from "@aldabil/react-scheduler";
import ja from 'date-fns/locale/ja'


import Sidebar from "./Components/Sidebar"
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

function App() {
  return (
    <div className="App">


      <Box sx={{ display: 'flex' }}>

        <Sidebar />

        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
           <Toolbar />
          <Scheduler
            locale={ja}
            view="month"
            events={[
              {
                event_id: 1,
                title: "Event 1",
                start: new Date("2022/5/2 09:30"),
                end: new Date("2022/5/2 10:30"),
              },
              {
                event_id: 2,
                title: "Event 2",
                start: new Date("2022/5/4 10:00"),
                end: new Date("2022/5/4 11:00"),
              },
            ]}
          />

        </Box>



      </Box>
    </div>
  );
}

export default App;
