import React, { useState } from "react";
import Card from "../components/UI/Card";
import "./NotificationItem.css";
import NotificationDate from "./NotificationDate";
import toast from "react-hot-toast";
import { updateStatus } from "../helper/helper";

function TaskItem({ task, deleteTask }) {
  const [isCompleted, setIsCompleted] = useState(task.done);
  const [isLoading, setIsLoading] = useState(false);
  let updatedTask;
  const handleCheckboxClick = async () => {
    try {
      setIsLoading(true);
      const token = await localStorage.getItem("token");
      setIsCompleted(!isCompleted);
      task.done = isCompleted;
      updatedTask = await updateStatus(task, token);
      toast.success("Task updated successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <li>
        <Card className="expense-item">
          <NotificationDate date={task.deadLine} title={task.data} />
          <div className="expense-item__description">
            {/* <h2>{task.data}</h2> */}
            <tr>
              <td>
                <h2>{task.data}</h2>
              </td>
              <td>{isCompleted ? "Completed" : "Incomplete"}</td>
              <td>
                <div onClick={handleCheckboxClick}>
                  <input
                    type="checkbox"
                    defaultChecked={isCompleted}
                    disabled={isLoading}
                  />
                </div>
              </td>
            </tr>
            <div>
              <button
                style={{ color: "white", padding: 20 }}
                type="button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      </li>
    </div>
  );
}

export default TaskItem;
