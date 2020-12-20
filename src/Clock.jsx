import { useState } from 'react';
import Modal from 'react-modal';

import './Clock.css';
import AlarmImage from "./Alarm.png";

window.onload = function () {

    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    const date = document.getElementById('date');

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    function setClock() {
        const today = new Date();

        const second = today.getSeconds();
        const minute = today.getMinutes();
        const hour = today.getHours();

        let secondDeg = ((second / 60) * 360);
        let minuteDeg = ((minute / 60) * 360);
        let hourDeg = ((hour / 12) * 360) + ((minute / 60) * 30);

        secondHand.style.transform = `rotate(${secondDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        hourHand.style.transform = `rotate(${hourDeg}deg)`;

        switch (today.getDate()) {
            case 1:
                date.innerHTML = '<span><strong>1st ' + months[today.getMonth()] + '</strong>, ' + today.getFullYear() + '</span>';
                break;
            case 2:
                date.innerHTML = '<span><strong>2nd ' + months[today.getMonth()] + '</strong>, ' + today.getFullYear() + '</span>';
                break;
            case 3:
                date.innerHTML = '<span><strong>3rd ' + months[today.getMonth()] + '</strong>, ' + today.getFullYear() + '</span>';
                break;
            default:
                date.innerHTML = '<span><strong>' + today.getDate() + 'th ' + months[today.getMonth()] + '</strong>, ' + today.getFullYear() + '</span>';
        }

        // document.getElementById("test").value = hour;
    }
    setClock();
    setInterval(setClock, 1000);
}

const Clock = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [alarm, triggerAlarm] = useState([]);

    // function openModal() {
    //     setIsOpen(true);
    // }

    function closeModal() {
        setIsOpen(false);
        if (alarm.length !== 0) {
            const LocalAlarmList = JSON.parse(localStorage.getItem("AlarmList"));
            LocalAlarmList.splice(0, 1);
            localStorage.setItem("AlarmList", JSON.stringify(LocalAlarmList));
            console.log(alarm);
            triggerAlarm([]);
        }
        window.location.reload(false);
    }

    function setAlarmTrigger() {
        const today = new Date();
        const minute = today.getMinutes();
        const hour = today.getHours();

        if (localStorage.getItem("AlarmList") !== null) {
            const LocalAlarmList = JSON.parse(localStorage.getItem("AlarmList"));
            if (LocalAlarmList.length > 0) {
                if (LocalAlarmList[0].Time.Hour === hour && LocalAlarmList[0].Time.Minute === minute && LocalAlarmList[0].Day === "Today") {
                    // console.log(LocalAlarmList[0]);
                    const AlarmModalDataList = {
                        Time: `${LocalAlarmList[0].Time.Hour} : ${LocalAlarmList[0].Time.Minute}`,
                        Reminder: LocalAlarmList[0].Reminder
                    }
                    triggerAlarm(AlarmModalDataList);
                    setIsOpen(true);
                }
            }
        }
    }

    setInterval(setAlarmTrigger, 10000);

    const AlarmTriggerBody = () => {

        return (
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <div className="modal">
                    <img src={AlarmImage} alt="" />
                    <h1> ALARM </h1>
                    <h2> {alarm.Time} </h2>
                    <h4> {alarm.Reminder} </h4>
                    <button onClick={closeModal}>close</button>
                </div>
            </Modal>
        );
    }

    return (
        <>
            <div className="background"></div>
            <div className="clock">
                <div className="hourHand" id="hourHand"></div>
                <div className="minuteHand" id="minuteHand"></div>
                <div className="secondHand" id="secondHand"></div>
                <div className="center"></div>
                <div className="date" id="date"></div>

                <ul>
                    <li><span>1</span></li>
                    <li><span>2</span></li>
                    <li><span>3</span></li>
                    <li><span>4</span></li>
                    <li><span>5</span></li>
                    <li><span>6</span></li>
                    <li><span>7</span></li>
                    <li><span>8</span></li>
                    <li><span>9</span></li>
                    <li><span>10</span></li>
                    <li><span>11</span></li>
                    <li><span>12</span></li>
                </ul>
            </div>

            {/* <button onClick={openModal}> OPEN MODAL </button> */}

            <AlarmTriggerBody />
        </>
    );
}

export default Clock;