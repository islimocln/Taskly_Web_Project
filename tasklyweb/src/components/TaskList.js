import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAllTasks();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Görevler yüklenirken bir hata oluştu.');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Görevler</h2>
            {tasks.length === 0 ? (
                <p>Henüz görev bulunmuyor.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Durum: {task.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList; 