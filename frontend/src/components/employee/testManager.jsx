import React, {useEffect, useState} from 'react'
import { Grid2 } from '@mui/material';
import axios from 'axios'
import './schManager.css'
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";



const styles = {
    wrap: {
      display: "flex"
    },
    left: {
      marginRight: "10px"
    },
    main: {
      flexGrow: "1"
    }
  };

  const scheduleForm = [
    { name: "Event Title", id: "text", type: "text" },
    { name: "Location ID", id: "locationID", type: "text" },
    { name: "Location ID", id: "locationID", type: "text" }
  ];

  const TestManager = () => {
      const [calendar, setCalendar] = useState(null);
      const [events, setEvents] = useState([]);
      const [startDate, setStartDate] = useState("2025-10-06");

      const [doctorOptions, setDoctorOptions] = useState([]);
      const [locationOptions, setLocationOptions] = useState([]);

      useEffect(() => {
        axios.get("http://localhost:5001/api/schedule/options")
          .then((res) => {
            setDoctorOptions(
              res.data.doctors.map(doc => ({
                name: doc.name,
                id: doc.id
              }))
            );
            setLocationOptions(
              res.data.locations.map(loc => ({
                name: loc.name,
                id: loc.id
              }))
            );
          })
          .catch(err => console.error("Error fetching doctor/location options:", err));
      }, []);

      const eventForm = [
        { name: "Event Title", id: "text", type: "text" },
        { name: "Doctor", id: "doctorID", type: "select", options: doctorOptions },
        { name: "Location", id: "locationID", type: "select", options: locationOptions },
        { name: "Day of Week", id: "dayOfWeek", type: "select", options: [
            { name: "Monday", id: "Monday" },
            { name: "Tuesday", id: "Tuesday" },
            { name: "Wednesday", id: "Wednesday" },
            { name: "Thursday", id: "Thursday" },
            { name: "Friday", id: "Friday" },
            { name: "Saturday", id: "Saturday" },
            { name: "Sunday", id: "Sunday" },
          ] },
        { name: "Start Time", id: "start", type: "datetime" },
        { name: "End Time", id: "end", type: "datetime" }
      ];

      const handleTimeRangeSelected = async (args) => {
        const formData = {
          start: args.start.toString(),
          end: args.end.toString(),
        };
    
        const modal = await DayPilot.Modal.form(eventForm, formData);
    
        if (!modal.result) return;
    
        const newEvent = {
          id: DayPilot.guid(),
          ...modal.result
        };

        try {
          await axios.post('http://localhost:5001/api/schedule', newEvent);
          setEvents(prev => [...prev, newEvent]);
        } catch (err) {
          console.error("Error saving event:", err);
          alert("Failed to save event.");
        }

        calendar.clearSelection();
      };
  
      const oForm = [
          

          
      ];

      const config = {
        viewType: "Resources",
        columns: doctorOptions.map(doc => ({
          id: doc.id,
          name: doc.name
        })),
        startDate: startDate,
        events: events,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: handleTimeRangeSelected
      };
  
      const oData = {};
      // const [config, setConfig] = useState({
      //     viewType: "Resources",
      //     columns: [],
      //     durationBarVisible: false,
      //     timeRangeSelectedHandling: "Enabled",
      //     onTimeRangeSelected: async args => {
      //       const formDefaults = {
      //         text: "New Event",
      //         locationID: "",
      //         dayOfweek: "",
      //         startTime: "",
      //         endTime: ""
      //       };
          
      //       const modal = await DayPilot.Modal.form(scheduleForm, formDefaults);
      //       if (modal.canceled) return;
          
      //       const { text, locationID, dayOfweek, startTime, endTime } = modal.result;
          
      //       const newEvent = {
      //         id: DayPilot.guid(),
      //         doctorID: args.resource,
      //         locationID,
      //         dayOfweek,
      //         startTime,
      //         endTime,
      //         text
      //       };
          
      //       try {
      //         await axios.post("http://localhost:5001/api/schedule", newEvent);
      //         alert("Event saved!");
          
      //         // Optional: add to calendar display
      //         setEvents(prev => [...prev, {
      //           id: newEvent.id,
      //           text,
      //           start: `${args.start.toString().split("T")[0]}T${startTime}`,
      //           end: `${args.start.toString().split("T")[0]}T${endTime}`,
      //           resource: args.resource
      //         }]);
      //       } catch (err) {
      //         console.error("Error saving event:", err);
      //         alert("Failed to save event.");
      //       }
      //     },
      //     onEventClick: async args => {
      //       await editEvent(args.e);
      //     },
      //     contextMenu: new DayPilot.Menu({
      //       items: [
      //         {
      //           text: "Delete",
      //           onClick: async args => {
      //             calendar.events.remove(args.source);
      //           },
      //         },
      //         {
      //           text: "-"
      //         },
      //         {
      //           text: "Edit...",
      //           onClick: async args => {
      //             await editEvent(args.source);
      //           }
      //         }
      //       ]
      //     }),
      //     onBeforeEventRender: args => {
      //       args.data.areas = [
      //         {
      //           top: 3,
      //           right: 3,
      //           width: 20,
      //           height: 20,
      //           // symbol: "icons/daypilot.svg#minichevron-down-2",
      //           // fontColor: "#fff",
      //           // toolTip: "Show context menu",
      //           // action: "ContextMenu",
      //         },
      //         {
      //           top: 3,
      //           right: 25,
      //           width: 20,
      //           height: 20,
      //           // symbol: "icons/daypilot.svg#x-circle",
      //           // fontColor: "#fff",
      //           // action: "None",
      //           // toolTip: "Delete event",
      //           onClick: async args => {
      //             calendar.events.remove(args.source);
      //           }
      //         }
      //       ];
      
      
      //       // const participants = args.data.participants;
      //       // if (participants > 0) {
      //       //   // show one icon for each participant
      //       //   for (let i = 0; i < participants; i++) {
      //       //     args.data.areas.push({
      //       //       bottom: 5,
      //       //       right: 5 + i * 30,
      //       //       width: 24,
      //       //       height: 24,
      //       //       action: "None",
      //       //       image: `https://picsum.photos/24/24?random=${i}`,
      //       //       style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      //       //     });
      //       //   }
      //       // }
      //     }
      //   });
      
        const editEvent = async (e) => {
          const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
          if (!modal.result) { return; }
          e.data.text = modal.result;
          calendar.events.update(e);
        };

        // useEffect(() => {
        //     axios.get('http://localhost:5001/api/schedule').then((res) => {
        //       console.log(res.data)
        //         setConfig(prev =>({
        //             ...prev,
        //             columns: res.data
                    
        //         }));
        //     }).catch(err => {
        //         console.error("Error fetching doctor columns:", err);
        //     });
            
        // }, []);
      
        // useEffect(() => {
        //   const events = [
        //     {
        //       id: 1,
        //       text: "Event 1",
        //       start: "2025-10-06T10:30:00",
        //       end: "2025-10-06T13:00:00",
        //       participants: 2,
        //     },
        //     {
        //       id: 2,
        //       text: "Event 2",
        //       start: "2025-10-07T09:30:00",
        //       end: "2025-10-07T11:30:00",
        //       backColor: "#6aa84f",
        //       participants: 1,
        //     },
        //     {
        //       id: 3,
        //       text: "Event 3",
        //       start: "2025-10-07T12:00:00",
        //       end: "2025-10-07T15:00:00",
        //       backColor: "#f1c232",
        //       participants: 3,
        //     },
        //     {
        //       id: 4,
        //       text: "Event 4",
        //       start: "2025-10-05T11:30:00",
        //       end: "2025-10-05T14:30:00",
        //       backColor: "#cc4125",
        //       participants: 4,
        //     },
        //   ];
        //   setEvents(events);
        // }, []);
      
  
      console.log(DayPilotCalendar);
      return (
              // <div>
              // {/* <DayPilotNavigator
              //     onTimeRangeSelected={ args => {
              //         setStartDate(args.day);
              //     }}
              // /> */}
              // <DayPilotCalendar
              //     {...config}
              //     startDate={startDate}  />
              // </div>
              <div style={styles.wrap}>
              <div style={styles.left}>
                <DayPilotNavigator
                  selectMode={"Week"}
                  showMonths={2}
                  skipMonths={2}
                  selectionDay={startDate}
                  onTimeRangeSelected={ args => {
                    setStartDate(args.day);
                  }}
                />
              </div>
              <div style={styles.main}>
                <DayPilotCalendar
                  {...config}
                  events={events}
                  startDate={startDate}
                  controlRef={setCalendar}
                />
              </div>
            </div>
              
         
      );
  }
  
  export default TestManager;