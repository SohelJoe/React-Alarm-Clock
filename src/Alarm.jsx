import { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
    TimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import './Alarm.css';

const Alarm = () => {
    const [selectedDate, handleDateChange] = useState(new Date());
    const [alarmCount, setAlarmCount] = useState(0);
    const [alert, setAlert] = useState(false);

    window.addEventListener('load', (event) => {
        if (localStorage.getItem("AlarmList") !== null) {
            var LocalAlarmList = JSON.parse(localStorage.getItem("AlarmList"));
            if (LocalAlarmList.length != null) {
                const today = new Date();

                for (let i = 0; i < LocalAlarmList.length; i++) {
                    if (today.getFullYear() > LocalAlarmList[i].Date.Year) {
                        // console.log("getFullYear");
                        LocalAlarmList.splice(i, 1);
                    }
                    else {
                        if (today.getMonth() > LocalAlarmList[i].Date.Month) {
                            // console.log("getMonth");
                            LocalAlarmList.splice(i, 1);
                        }
                        else {
                            if (today.getDate() > LocalAlarmList[i].Date.Day) {
                                // console.log("getDate");
                                LocalAlarmList.splice(i, 1);
                            }
                            else if (today.getDate() === LocalAlarmList[i].Date.Day) {
                                if (today.getHours() > LocalAlarmList[i].Time.Hour) {
                                    // console.log("getHours");
                                    LocalAlarmList.splice(i, 1);
                                }
                                else if (today.getHours() === LocalAlarmList[i].Time.Hour) {
                                    if (today.getMinutes() > LocalAlarmList[i].Time.Minute) {
                                        // console.log("getMinutes");
                                        LocalAlarmList.splice(i, 1);
                                    }
                                    else {
                                        break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                localStorage.setItem("AlarmList", JSON.stringify(LocalAlarmList));
                setAlarmCount(LocalAlarmList.length);
            }
        }
        else {
            localStorage.setItem("AlarmList", JSON.stringify([]));
        }
    });

    const GetDayRemaining = (alarmMinute, alarmHour) => {
        const today = new Date();
        const minute = today.getMinutes();
        const hour = today.getHours();

        var Remaining = {
            TimeRemaining: "",
            Day: "",
        }

        if (alarmHour > hour) {
            Remaining.TimeRemaining = ((alarmHour * 60) + alarmMinute) - ((hour * 60) + minute);
            Remaining.Day = "Today";
            return Remaining;
        }
        else if (alarmHour < hour) {
            Remaining.TimeRemaining = (((alarmHour + 24) * 60) + alarmMinute) - ((hour * 60) + minute);
            Remaining.Day = "Tommorow";
            return Remaining;
        }
        else {
            if (alarmMinute > minute) {
                Remaining.TimeRemaining = alarmMinute - minute;
                Remaining.Day = "Today";
                return Remaining;
            }
            else {
                Remaining.TimeRemaining = (24 * 60) - (minute - alarmMinute);
                Remaining.Day = "Tommorow";
                return Remaining;
            }
        }
    }

    const setAlarmDate = (alarmMinute, alarmHour) => {

        var DayAndRemaining = GetDayRemaining(alarmMinute, alarmHour);
        var DayDate = {
            Day: DayAndRemaining.Day,
            Remaining: DayAndRemaining.TimeRemaining,
            Date: ""
        };

        if (DayDate.Day === "Today") {
            DayDate.Date = { Day: selectedDate.getDate(), Month: selectedDate.getMonth() + 1, Year: selectedDate.getFullYear() };
        }
        else {
            var Day = selectedDate.getDate() + 1;
            var Month = selectedDate.getMonth() + 1;
            var Year = selectedDate.getFullYear();
            DayDate.Date = {
                Day: (Day) % 30,
                Month: (Month + Math.trunc(Day / 30)) % 13,
                Year: Year + Math.trunc((Month + Math.trunc(Day / 30)) / 13)
            };
        }
        return DayDate;
    }

    const AlarmListUpdate = () => {
        var list = JSON.parse(localStorage.getItem("AlarmList"));
        if (list != null) {
            for (let i = 0; i < list.length; i++) {
                list[i].Remaining = GetDayRemaining(list[i].Time.Minute, list[i].Time.Hour).TimeRemaining;
            }
            return (list);
        }
    }

    const AlarmListInsert = () => {
        var DayDate = setAlarmDate(selectedDate.getMinutes(), selectedDate.getHours());
        var alarm = {
            Time: { Hour: selectedDate.getHours(), Minute: selectedDate.getMinutes() },
            Date: DayDate.Date,
            Day: DayDate.Day,
            Reminder: document.getElementById("reminder").value,
            Remaining: DayDate.Remaining,
        };

        var UpdatedList = AlarmListUpdate();

        if (UpdatedList.length === 0) {

            UpdatedList.unshift(alarm);

        }
        else if (UpdatedList.length === 1) {
            if (UpdatedList[0].Remaining > alarm.Remaining) {
                UpdatedList.unshift(alarm);
            }
            else if (UpdatedList[0].Remaining === alarm.Remaining) {
                // alert("You've Already Set This Alarm");
                toggleAlert(true);
            }
            else {
                UpdatedList.push(alarm);
            }
        }
        else {
            for (let i = 0; i < UpdatedList.length - 1; i++) {
                if (UpdatedList[i].Remaining > alarm.Remaining) {
                    UpdatedList.unshift(alarm);
                    break;
                }
                else if (UpdatedList[i].Remaining < alarm.Remaining && UpdatedList[i + 1].Remaining > alarm.Remaining) {
                    UpdatedList.splice(i + 1, 0, alarm);
                    break;
                }
                else if (UpdatedList[i + 1].Remaining < alarm.Remaining && i === UpdatedList.length - 2) {
                    UpdatedList.push(alarm);
                    break;
                }
                else if (UpdatedList[i].Remaining === alarm.Remaining || UpdatedList[i + 1].Remaining === alarm.Remaining) {
                    // alert("You've Already Set This Alarm");
                    toggleAlert(true);

                }
            }
        }
        localStorage.setItem("AlarmList", JSON.stringify(UpdatedList));
    }

    const click = () => {
        AlarmListInsert();
        setAlarmCount(alarmCount + 1);
    }

    // const showLocalStorage = () => {
    //     var list = JSON.parse(localStorage.getItem("AlarmList"));
    //     console.log(list);
    // }

    const localStorageClear = () => {
        localStorage.removeItem("AlarmList");
        window.location.reload(false);
    }

    const toggleAlert = (condition) => {
        if (alert) {
            setAlert(false);
        }
        else {
            setAlert(condition);
        }
    }

    const AlertBox = () => {
        if (alert) {
            return (
                <div className="alert">
                    <span className="closebtn" onClick={toggleAlert}>&times;</span>
                    <strong>Danger!</strong> You've Already Set This Alarm.
                </div>
            );
        }
        else {
            return (
                <></>
            );
        }
    }

    const deleteAlarm = (e) => {
        var LocalAlaramList = JSON.parse(localStorage.getItem("AlarmList"));
        LocalAlaramList.splice(e.target.id, 1);
        localStorage.setItem("AlarmList", JSON.stringify(LocalAlaramList));
        setAlarmCount(LocalAlaramList.length);
    }


    const ArarmListShow = () => {
        if (alarmCount === 0) {
            return (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th><th>Day</th><th>Occation</th><th></th>
                            </tr>
                        </thead>
                    </table>
                </>
            );
        }
        else {
            return (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th><th>Day</th><th>Occation</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {JSON.parse(localStorage.getItem("AlarmList")).map((item, key) => (
                                <tr key={key}>
                                    <td> {`${item.Time.Hour} : ${item.Time.Minute}`} </td>
                                    <td> {item.Day} </td>
                                    <td> {item.Reminder} </td>
                                    <td> <span className="closebtn" id={key} onClick={deleteAlarm}>&times;</span> </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            );
        }
    }


    return (
        <>
            <div className="container">
                <nav>
                    <div>
                        <h2> Set Alarm </h2>
                    </div>
                    <div className="form">
                        <div className="timePicker">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker value={selectedDate} onChange={handleDateChange} />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="reminderText">
                            <input type="textBox" id="reminder" placeholder="Reminder Text" />
                        </div>
                        <div className="setButton">
                            <button onClick={click}> Set </button>
                        </div>
                    </div>
                    <AlertBox />
                </nav>

                <div id="table">
                    <ArarmListShow />
                </div>

                <footer>
                    {/* <button onClick={showLocalStorage} >LOCAL STORAGE</button> */}
                    <button onClick={localStorageClear} > DELETE ALL ALARMS </button>
                </footer>

            </div>
        </>
    );
}

export default Alarm;