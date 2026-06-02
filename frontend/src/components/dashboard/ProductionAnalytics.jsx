export default function ProductionAnalytics() {

  const analytics = [
    {
      title: "Scene Completion",
      value: "92%"
    },
    {
      title: "Crew Efficiency",
      value: "87%"
    },
    {
      title: "Budget Usage",
      value: "68%"
    },
    {
      title: "Asset Processing",
      value: "95%"
    }
  ];

  return (
    <div className="analytics-section">

      <h2>Production Analytics</h2>

      <div className="analytics-grid">

        {analytics.map((item, index) => (

          <div className="analytics-card" key={index}>

            <div className="analytics-top">

              <span>{item.title}</span>

              <h3>{item.value}</h3>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: item.value }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}