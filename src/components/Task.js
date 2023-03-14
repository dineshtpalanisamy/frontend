import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import styles from "../styles/Username.module.css";
import NotificationFilter from "./NotificationFilter";
import toast from "react-hot-toast";
import TaskItem from "./TaskItem";
import "./TaskForm.css";
import { getTask, deleteTasks } from "../helper/helper";

function Task() {
  const notificationTypeOptions = ["push", "email", "sms"];
  const notificationFrequencyOptions = ["daily", "weekly", "monthly"];
  const [taskList, setTaskList] = useState([]);
  const [deadLine, setDeadLine] = useState("");
  const [notificationEnabled, setnotificationEnabled] = useState(true);
  const [notificationType, setNotificationType] = useState(
    notificationTypeOptions[0]
  );
  const [notificationFrequency, setNotificationFrequency] = useState(
    notificationFrequencyOptions[0]
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTask, setNewTask] = useState("");

  const filterChangeHandler = (selectedType) => {
    setNotificationType(selectedType);
  };
  const filterFrequencyHandler = (selectedType) => {
    setNotificationFrequency(selectedType);
  };

  const getTasks = async () => {
    try {
      let arrTask = [];
      let { data } = await getTask();
      data = data.map((task, index, array) => {
        array[index].deadLine = String(
          moment(array[index].deadLine).format("YYYY-MM-DD")
        );
        return task;
      });
      console.log(data);
      arrTask.push(data);
      setTaskList(...arrTask);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addNewTask = async (e) => {
    e.preventDefault();
    const notify = window.confirm(
      "Do you want notification to be enabled for this task?"
    );
    console.log(" notify", notify);
    if (notify !== true) {
      console.log(" came inside if");
      setnotificationEnabled(notify);
    }

    setDeadLine(moment().add(e, "days").format("YYYY-MM-DD"));

    if (newTask.length <= 0) {
      toast.error("Task is empty");
      return;
    }
    console.log("notificationEnabled", notificationEnabled);
    try {
      const token = await localStorage.getItem("token");
      const constructedData = {
        title: newTask,
        deadLine,
        notificationEnabled: notify,
        notificationType,
        notificationFrequency,
      };
      const { data } = await axios.post(
        "http://localhost:8080/api/tasks/",

        constructedData,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsAddingNew(false);
      setNewTask("");
      // setnotificationEnabled(notificationEnabled);
      setDeadLine("");
      setNotificationType(notificationTypeOptions[0]);
      setNotificationFrequency(notificationFrequencyOptions[0]);
      setTaskList([{ ...data }, ...taskList]);
      console.log("task list ", taskList);
    } catch (err) {
      console.log(err);
    }
  };
  const addNewButtonClick = () => {
    let isAddingNew = true;
    setIsAddingNew(isAddingNew);
  };

  const deleteTask = async (id) => {
    try {
      const token = await localStorage.getItem("token");
      await deleteTasks(id, token);
      toast.success("Task deleted");
      setTaskList(taskList.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const stopEditingHandler = () => {
    setIsAddingNew(false);
  };

  const dateChangeHandler = (event) => {
    setDeadLine(event.target.value);
  };
  return (
    <div>
      <div>
        <button
          type="button"
          className={styles.btn}
          onClick={addNewButtonClick}
        >
          Add New Task
        </button>
      </div>
      {isAddingNew && (
        <form className="py-1" onSubmit={addNewTask}>
          <div className="new-expense__controls">
            <div className="new-expense__control">
              <label>Title</label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Task Name"
                autoFocus
              />
            </div>
            <div className="new-expense__control">
              <label>Date</label>
              <input
                type="date"
                min="2019-01-01"
                max="2023-12-31"
                value={deadLine}
                onChange={dateChangeHandler}
                placeholder="Days to complete"
                autoFocus
              />
            </div>
          </div>
          <NotificationFilter
            selected={notificationType}
            onChangeFilter={filterChangeHandler}
            frequencySelected={notificationFrequency}
            onChangeFrequency={filterFrequencyHandler}
          />

          <button className={styles.btn} type="submit" color="black">
            Add
          </button>

          <button
            className={styles.btn}
            type="button"
            onClick={stopEditingHandler}
          >
            Cancel
          </button>
        </form>
      )}

      {taskList.length > 0 ? (
        <table>
          <tbody>
            {taskList.map((task) => (
              <TaskItem key={task._id} task={task} deleteTask={deleteTask} />
            ))}
          </tbody>
        </table>
      ) : (
        "No Task Found. Create a new task"
      )}
    </div>
  );
}

export default Task;
