"use client";

import { Suspense } from "react";
import { ProjectTableData, ProjectsData } from "../types";
import { gql, useQuery } from "@apollo/client";
import { ColumnDef } from "@tanstack/react-table";
import ListVisualizer from "~~/components/kyklos/molecules/listVisualizer";

const GetProjects = () => {
  const GET_PROJECTS = gql`
    query GetProjects {
      projects(first: 10) {
        category
        emissionType
        method
        methodology
        projectId
        region
        standard
        storageMethod
        timestamp
        tx
        uri
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery<ProjectsData>(GET_PROJECTS);
  console.log("{ loading, error, data: projects }:", data?.projects);

  // Add your component logic here
  const columns: ColumnDef<ProjectTableData>[] = [
    {
      header: "Project ID",
      accessorKey: "projectId",
    },
    {
      header: "Region",
      accessorKey: "region",
    },
    {
      header: "Standard",
      accessorKey: "standard",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
  ];

  const rows = data?.projects ?? [];

  return (
    <Suspense fallback="loading">
      <ListVisualizer columns={columns} data={rows}></ListVisualizer>
    </Suspense>
  );
};

export default GetProjects;
