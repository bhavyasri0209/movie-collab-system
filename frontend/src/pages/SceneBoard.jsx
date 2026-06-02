import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import { useState } from "react";

import "../styles/sceneboard.css";

export default function SceneBoard() {

  const [columns, setColumns] = useState({

    pending: {
      name: "Pending",
      items: [
        { id: "1", title: "Scene 12 - Space Dock" },
        { id: "2", title: "Scene 4 - Earth Farm" }
      ]
    },

    shooting: {
      name: "Shooting",
      items: [
        { id: "3", title: "Scene 8 - Black Hole" }
      ]
    },

    editing: {
      name: "Editing",
      items: [
        { id: "4", title: "Scene 2 - Intro Sequence" }
      ]
    },

    approved: {
      name: "Approved",
      items: [
        { id: "5", title: "Scene 1 - Opening Shot" }
      ]
    }

  });

  const onDragEnd = (result) => {

    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    const sourceColumn =
      columns[source.droppableId];

    const destColumn =
      columns[destination.droppableId];

    const sourceItems =
      [...sourceColumn.items];

    const destItems =
      [...destColumn.items];

    const [removed] =
      sourceItems.splice(source.index, 1);

    destItems.splice(
      destination.index,
      0,
      removed
    );

    setColumns({
      ...columns,

      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },

      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });

  };

  return (

    <div className="scene-board">

      <h1>Production Scene Workflow</h1>

      <DragDropContext onDragEnd={onDragEnd}>

        <div className="board-columns">

          {
            Object.entries(columns).map(
              ([id, column]) => (

              <div className="board-column" key={id}>

                <h2>{column.name}</h2>

                <Droppable droppableId={id}>

                  {(provided) => (

                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="droppable-col"
                    >

                      {
                        column.items.map(
                          (item, index) => (

                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >

                            {(provided) => (

                              <div
                                className="scene-card"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >

                                {item.title}

                              </div>

                            )}

                          </Draggable>

                        ))
                      }

                      {provided.placeholder}

                    </div>

                  )}

                </Droppable>

              </div>

            ))
          }

        </div>

      </DragDropContext>

    </div>
  );
}