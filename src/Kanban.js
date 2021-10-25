import React, { useState } from "react";
import { columnsRawData } from "./KanbanData";
import KanbanColumn from "./KanbanColumn";
import "./Kanban.css";
import KanbanModal from "./KanbanModal";
import { DragDropContext } from "react-beautiful-dnd";

const Kanban = () => {
    const [columns, setColumns] = useState(
        JSON.parse(window.localStorage.getItem("columns")) || columnsRawData
    );
    const [modal, setModal] = useState(false);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            console.log("no destination");
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            console.log("index and destination the same");
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);

            const swapTask = newTaskIds[source.index];
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, swapTask);

            const newColumnsState = columns.map((c) => {
                if (c.id === start.id) {
                    c.taskIds = newTaskIds;
                    return c;
                } else return c;
            });

            const newColumnsState2 = [...newColumnsState];
            setColumns(newColumnsState2);
        } else {
            if (finish.taskIds.length < finish.limit) {
                const startTaskIds = Array.from(start.taskIds);
                const [item] = startTaskIds.splice(source.index, 1);

                const finishTaskIds = Array.from(finish.taskIds);
                finishTaskIds.splice(destination.index, 0, item);

                const newColumnsState = columns.map((c) => {
                    if (c.id === start.id) {
                        c.taskIds = startTaskIds;
                        return c;
                    } else if (c.id === finish.id) {
                        c.taskIds = finishTaskIds;
                        return c;
                    } else return c;
                });
                const newColumnsState2 = [...newColumnsState];
                setColumns(newColumnsState2);
                window.localStorage.setItem("columns", JSON.stringify(columns));
            } else return;
        }
    };

    const openModal = (data) => {
        const columnId = data.id;
        setModal(columnId);
    };

    const closeModal = () => {
        setModal(false);
    };

    const addTask = (newTask) => {
        setModal(false);
        const updatedColumns = columns.map((column) => {
            if (column.id === newTask.idColumn) {
                column.taskIds.push(newTask);
                return column;
            } else return column;
        });
        setColumns(updatedColumns);
        window.localStorage.setItem("columns", JSON.stringify(columns));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="Kanban">
                {modal && (
                    <KanbanModal
                        closeModal={closeModal}
                        addTask={addTask}
                        columnData={modal}
                    />
                )}
                <h1 className="Kanban-title">Kanban</h1>
                <div className="Kanban-columns-container">
                    {columns.map((c) => {
                        return (
                            <KanbanColumn
                                columnData={c}
                                key={c.name}
                                openModal={openModal}
                            />
                        );
                    })}
                </div>
            </div>
        </DragDropContext>
    );
};

export default Kanban;
