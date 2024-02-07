import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faPencil } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

const TaskList = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const nickname = "heysondasdasdaaaadddad";
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/8.3.0",
      },
    };
    fetch(
      `https://playground.4geeks.com/apis/fake/todos/user/${nickname}`,
      options
    )
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setTaskList(data);
      })
      .catch((err) => {
        if (err.message.includes("NOT FOUND")) {
          const postOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "insomnia/8.3.0",
            },
            body: JSON.stringify([]), // Enviar una lista de tareas vacía
          };
          fetch(
            `https://playground.4geeks.com/apis/fake/todos/user/${nickname}`,
            postOptions
          )
            .then((response) => {
              if (!response.ok) {
                throw Error(response.statusText);
              }
              return response.json();
            })
            .then((data) => {
              // Intenta obtener la lista de tareas del usuario nuevamente
              fetch(
                `https://playground.4geeks.com/apis/fake/todos/user/${nickname}`,
                options
              )
                .then((response) => {
                  if (!response.ok) {
                    throw Error(response.statusText);
                  }
                  return response.json();
                })
                .then((data) => {
                  // Actualiza el estado con la lista de tareas obtenida
                  setTaskList(data);
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        } else {
          console.error(err);
        }
      });
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task) {
      setAlert({
        show: true,
        msg: "Por favor, introduce una tarea",
        type: "danger",
      });
    } else if (task && isEditing) {
      const newTaskList = taskList.map((item) => {
        if (item.id === editID) {
          return { ...item, label: task };
        }
        return item;
      });
      setTaskList(newTaskList);
      updateTasks(newTaskList);
      setTask("");
      setEditID(null);
      setIsEditing(false);
      setAlert({ show: true, msg: "Valor cambiado", type: "success" });
    } else {
      const newTask = { id: uuidv4(), label: task, done: false };
      const newTaskList = [...taskList, newTask];
      setTaskList(newTaskList);
      updateTasks(newTaskList);
      setTask("");
      setAlert({
        show: true,
        msg: "Tarea añadida a la lista",
        type: "success",
      });
    }
  };

  const clearTasks = () => {
    const tempTask = { id: "temp", label: "Example Task!", done: false };
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${nickname}`, {
      method: "PUT",
      body: JSON.stringify([tempTask]),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTaskList([]);
        setAlert({
          show: true,
          msg: "Todas tareas eliminadas",
          type: "danger",
        });
      })
      .catch((error) => console.log(error));
  };

  const updateTasks = (tasks) => {
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${nickname}`, {
      method: "PUT",
      body: JSON.stringify(tasks),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  const deleteTask = (id) => {
    const newTaskList = taskList.filter((task) => task.id !== id);
    setTaskList(newTaskList);
    updateTasks(newTaskList);
    setAlert({
      show: true,
      msg: "Tarea eliminada",
      type: "danger",
    });
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
                className="list-group-item d-flex justify-content-center align-items-center "
              >
                {item.label}
                <div className="ps-3">
                  <button
                    className="btn btn-outline-success mr-2 hide-button"
                    onClick={() => {
                      setTask(item.label);
                      setEditID(item.id);
                      setIsEditing(true);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPencil}
                      style={{ color: "#63E6BE" }}
                    />
                  </button>
                  <button
                    className="btn btn-outline-danger hide-button ms-2"
                    onClick={() => deleteTask(item.id)}
                  >
                    <FontAwesomeIcon
                      icon={faDeleteLeft}
                      style={{ color: "#ff0000" }}
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline-danger" onClick={clearTasks}>
            Limpiar todas las tareas
          </button>
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
