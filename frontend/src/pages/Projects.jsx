import { useEffect, useState } from "react";

import "../styles/projects.css";

import { getProjects } from "../services/projectService";

export default function Projects() {

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchProjects();

  }, []);

  const fetchProjects = async () => {

    try {

      const response = await getProjects();

      if(Array.isArray(response.data)){

        setProjects(response.data);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  if(loading){

    return (

      <div className="projects-page">

        <h1>Loading Productions...</h1>

      </div>

    );

  }

  return (

    <div className="projects-page">

      <h1>Movie Productions</h1>

      <div className="projects-grid">

        {
          projects.map((project, index) => (

            <div className="project-card" key={index}>

              <h2>{project.title}</h2>

              <p>{project.description}</p>

              <span>{project.status}</span>

            </div>

          ))
        }

      </div>

    </div>

  );
}