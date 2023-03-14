import React, { useState } from "react";
import moment from "moment";
import "./TaskForm.css";

function TaskForm(props) {
  const [taskList, setTaskList] = useState([]);
  const [deadLine, setDeadLine] = useState("");

  const titleChangeHandler = (event) => {
    setTaskList(event.target.value);
  };
  const dateChangeHandler = (event) => {
    setDeadLine(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const taskData = {
      title: taskList,
      deadLine: deadLine,
    };

    props.onSaveTaskData(taskData);
    setTaskList("");
    setDeadLine("");
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>Title</label>
          <input type="text" value={taskList} onChange={titleChangeHandler} />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type="date"
            min="2019-01-01"
            max="2023-12-31"
            value={deadLine}
            onChange={dateChangeHandler}
          />
        </div>
      </div>
      <div className="new-expense__actions">
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
