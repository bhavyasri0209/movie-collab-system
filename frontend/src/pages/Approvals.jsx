import { useState } from "react";

import "../styles/approvals.css";

export default function Approvals() {

  const [approvals, setApprovals] = useState([
    {
      id: 1,
      title: "Scene 12 - Final Edit",
      status: "Pending"
    },
    {
      id: 2,
      title: "Trailer Sound Design",
      status: "Pending"
    },
    {
      id: 3,
      title: "VFX Color Correction",
      status: "Pending"
    }
  ]);

  const updateStatus = (id, newStatus) => {

    const updated = approvals.map((item) => {

      if(item.id === id){

        return {
          ...item,
          status: newStatus
        };

      }

      return item;

    });

    setApprovals(updated);

  };

  return (

    <div className="approvals-page">

      <div className="approval-header">

        <h1>Director Approval Workflow</h1>

      </div>

      <div className="approval-grid">

        {
          approvals.map((item) => (

            <div
              className="approval-card"
              key={item.id}
            >

              <h2>{item.title}</h2>

              <span
                className={
                  item.status.toLowerCase()
                }
              >

                {item.status}

              </span>

              <div className="approval-buttons">

                <button
                  className="approve-btn"
                  onClick={() =>
                    updateStatus(
                      item.id,
                      "Approved"
                    )
                  }
                >

                  Approve

                </button>

                <button
                  className="reject-btn"
                  onClick={() =>
                    updateStatus(
                      item.id,
                      "Rejected"
                    )
                  }
                >

                  Reject

                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
}