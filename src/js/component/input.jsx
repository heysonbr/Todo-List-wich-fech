import React, { useState } from "react";

const TaskList = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task) {
      setAlert({
        show: true,
        msg: "Por favor, introduce una tarea",
        type: "danger",
      });
    } else if (task && isEditing) {
      setTaskList(
        taskList.map((item) => {
          if (item.id === editID) {
            return { ...item, task };
          }
          return item;
        })
      );
      setTask("");
      setEditID(null);
      setIsEditing(false);
      setAlert({ show: true, msg: "Valor cambiado", type: "success" });
    } else {
      const newTask = { id: new Date().getTime().toString(), task };
      setTaskList([...taskList, newTask]);
      setTask("");
      setAlert({
        show: true,
        msg: "Tarea añadida a la lista",
        type: "success",
      });
    }
  };

  return (
    <div className="container mt-5">
      {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.msg}
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe una tarea"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <div className="input-group-append">
                <button className="btn btn-outline-primary" type="submit">
                  {isEditing ? "Editar" : "Añadir"}
                </button>
              </div>
            </div>
          </form>
          <ul className="list-group list-group-flush">
            {taskList.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-center align-items-center"
              >
                {item.task}
                <div>
                  <button
                    className="btn btn-outline-success mr-2 hide-button"
                    onClick={() => {
                      setTask(item.task);
                      setEditID(item.id);
                      setIsEditing(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger hide-button"
                    onClick={() => {
                      setTaskList(
                        taskList.filter((task) => task.id !== item.id)
                      );
                      setAlert({
                        show: true,
                        msg: "Tarea eliminada",
                        type: "danger",
                      });
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer text-muted">
          {taskList.length > 0
            ? `Hay ${taskList.length} ${
                taskList.length === 1 ? "tarea" : "tareas"
              }`
            : "Agrega Tareas"}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
