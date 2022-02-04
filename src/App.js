// import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';
import Footer from './components/Footer';


function App() {
  const [showAddTask, setshowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Fetching tasks 
  const fetchTasks = async ()=>{
    const res = await fetch('http://localhost:5000/tasks');
    const data =  await res.json();

    return data;
  }

  // Fetching tasks 
  const fetchTask = async (id)=>{
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data =  await res.json();

    return data;
  }

  useEffect(() =>{
    const getTasks = async ()=>{
      const tasksFromServer = await fetchTasks();

      setTasks(tasksFromServer);
    }

    getTasks();
  }, []);

  // Add Task
  const addTask = async (task) =>{
    const res = await fetch('http://localhost:5000/tasks', {
      method:'POST',
      headers: {
        'Content-type':'application/json',
      },
      body: JSON.stringify(task)
    },
    )

    const data = await res.json();
    setTasks([...tasks, data]);
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id , ...task};
    // setTasks([...tasks, newTask]);
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updateTask = await {...taskToToggle, reminder:!taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method:'PUT',
      headers: {
        'Content-type':'application/json',
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  let deleteTask =async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method:'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <Router>
      <div className="container">
    
          <Header displayForm={() => setshowAddTask(!showAddTask)} showAdd={showAddTask} />
          <Routes>
          <Route path='/' element={
            <>
              {showAddTask && <AddTask onAdd={addTask}  />}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No Tasks to show'}
            </>
          } />
          <Route path='/about' element={<About />} />
          </Routes>
          <Footer/>
      
      </div>
    </Router>
  );
}

// class App extends React.Component{
//   render(){
//     return (
//       <>
//       <Header/>
//       Hello There
//       </>
//     )
//   }
// }

export default App;
