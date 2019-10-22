import * as React from "react";
import Paper from "@material-ui/core/Paper";
//import "./CalendarScheduler.css";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm
} from "@devexpress/dx-react-scheduler-material-ui";

import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import { useState } from "react";
import axios from "axios";
import moment from "moment";

type NotificationProfilesTypes = {
  title: string;
  startDate: Date;
  endDate: Date;
  id: number;
}[];

type PropType = {};

const CalendarScheduler: React.FC<PropType> = props => {
  const [notificationProfiles, setNotificationsProfiles] = useState<
    NotificationProfilesTypes
  >([]);

  React.useEffect(() => {
    fetchNotificationProfiles();
  }, []);

  const fetchNotificationProfiles = async () => {
    await axios({
      url: "http://localhost:8000/notificationprofiles/",
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }).then((response: any) => {
      const serialized = serializeData(response);
      setNotificationsProfiles(serialized);
    });
  };

  const serializeData = (dataFromAPI: any) => {
    const profilesList: any = [];
    for (let i = 0; i < dataFromAPI.data.length; i++) {
      let profile = dataFromAPI.data[i];

      let startDate = moment(dataFromAPI.data[i].interval_start)
        .format("YYYY MM DD HH mm")
        .split(" ")
        .map(function(item) {
          return parseInt(item, 10);
        });
      let endDate = moment(dataFromAPI.data[i].interval_stop)
        .format("YYYY MM DD HH mm")
        .split(" ")
        .map(function(item) {
          return parseInt(item, 10);
        });
      //Creating a javascript object to fit the mapping of rendered items
      let object = {
        id: dataFromAPI.data[i].pk,
        title: profile.name,
        startDate: new Date(
          startDate[0],
          startDate[1],
          startDate[2],
          startDate[3],
          0
        ),
        endDate: new Date(endDate[0], endDate[1], endDate[2], endDate[3], 0)
      };
      profilesList.push(object);
    }
    return profilesList;
  };

  function onCommitChanges({ added, changed, deleted }: any) {
    if (typeof added !== "undefined") {
      console.log("added", added);

      // TODO: Save new profile to backend
    }
  }

  const postNotificationProfile = async () => {
    await axios({
      url: "http://localhost:8000/notificationprofiles/",
      method: "POST",
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      },
      data: {
        name: "torsdag",
        interval_start: "2018-06-12 09:55:22",
        interval_stop: "2018-06-12 09:55:22"
      }
    });
  };

  function onAddedAppointmentChange(addedAppointment: any) {
    console.log("Added appointment", addedAppointment);
  }
  return (
    <div>
      <div className="calendar-container">
        <Paper>
          <Scheduler data={notificationProfiles} height={660}>
            <EditingState
              onCommitChanges={onCommitChanges}
              onAddedAppointmentChange={onAddedAppointmentChange}
            />
            <ViewState defaultCurrentDate={new Date(2018, 7, 12, 0, 0)} />
            <WeekView startDayHour={0} endDayHour={24} cellDuration={60} />
            <Appointments />
            <AppointmentTooltip />
            <AppointmentForm />
          </Scheduler>
        </Paper>
      </div>
    </div>
  );
};

export default CalendarScheduler;
