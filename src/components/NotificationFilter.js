import React from "react";
import "./NotificationFilter.css";
function NotificationFilter(props) {
  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value);
  };
  const notificationFrequencyHandler = (event) => {
    props.onChangeFrequency(event.target.value);
  };
  return (
    <div className="expenses-filter">
      <div className="expenses-filter__control">
        <label>Select Notification type </label>
        <select value={props.selected} onChange={dropdownChangeHandler}>
          <option value="push">PUSH</option>
          <option value="email">EMAIL</option>
          <option value="sms">SMS</option>
        </select>
        <label>Select Notification Frequency </label>
        <select
          value={props.frequencySelected}
          onChange={notificationFrequencyHandler}
        >
          <option value="daily">DAILY</option>
          <option value="weekly">WEEKLY</option>
          <option value="monthly">MONTHLY</option>
        </select>
      </div>
    </div>
  );
}

export default NotificationFilter;
