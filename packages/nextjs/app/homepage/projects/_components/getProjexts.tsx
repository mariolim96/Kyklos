/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense } from "react";
import { ProjectTableData, ProjectsData } from "../types";
import { gql, useQuery } from "@apollo/client";
import { ColumnDef } from "@tanstack/react-table";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlinePlace } from "react-icons/md";
import { TbCertificate2 } from "react-icons/tb";
import ListVisualizer, { checkFilter } from "~~/components/kyklos/organism/listVisualizer";
import { Badge } from "~~/components/kyklos/ui/badge";
import Loader from "~~/components/kyklos/ui/loader";

const GetProjects = () => {
  const GET_PROJECTS = gql`
    query GetProjects {
      projects(first: 10) {
        id
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

  const { loading, data } = useQuery<ProjectsData>(GET_PROJECTS);

  // Add your component logic here
  const columns: ColumnDef<ProjectTableData>[] = [
    {
      header: "Project",
      accessorKey: "projectId",
      filterFn: checkFilter,
      meta: {
        filterVariant: "text",
      },
      cell: cell => (
        <div className="flex items-center gap-4">
          <div className=" h-26 w-40 relative">
            <img
              src={"/reforestation.jpg"}
              alt="reforestation"
              width="0"
              height={"0"}
              className="w-full h-full align-middle content-center rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-base-content-4 ">{cell.getValue() as string}</span>
            <Badge variant="info" className="w-fit rounded-xl">
              kyklos-{cell.row.id}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      header: "Region",
      accessorKey: "region",
      filterFn: checkFilter,
      cell: cell => (
        <div className="flex items-center gap-2">
          <MdOutlinePlace className="text-lg text-base-content-4" />
          <span className="text-lg font-semibold text-base-content ">{cell.getValue() as string}</span>
        </div>
      ),
    },
    {
      header: "Standard",
      accessorKey: "standard",
      filterFn: checkFilter,
      cell: cell => (
        <div className="flex items-center gap-2">
          <TbCertificate2 className="text-lg text-base-content-4" />
          <span className="text-lg font-semibold text-base-content ">{cell.getValue() as string}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      filterFn: checkFilter,
      cell: cell => (
        <div className="flex items-center gap-2">
          <BiCategoryAlt className="text-lg text-base-content-4" />
          <span className="text-lg font-semibold text-base-content ">{cell.getValue() as string}</span>
        </div>
      ),
    },
  ];

  const rows = data?.projects ?? [];

  return (
    <Suspense fallback={<Loader />}>
      <h2 className="m-4 font-semibold">
        Projects({loading ? <span className="loading loading-spinner loading-sm"></span> : rows?.length})
      </h2>
      <ListVisualizer columns={columns} data={[...rows, ...rows]}></ListVisualizer>
    </Suspense>
  );
};

export default GetProjects;
