"use client";

import { Project } from "../../types";
import StepperDemo from "./_components/credits";
import { gql, useQuery } from "@apollo/client";
import { MdOutlineFolderCopy } from "react-icons/md";
import Text from "~~/components/kyklos/ui/text";

// My Post: {params.projectId} e serena e scema
export default function Page({ params }: { params: { projectId: string } }) {
  const GET_PROJECT = gql`
    query MyQuery {
      project(id: "${params.projectId}") {
        uri
        tx
        timestamp
        storageMethod
        standard
        region
        projectId
        methodology
        method
        id
        emissionType
        category
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_PROJECT);
  const project = data?.project as Project;

  console.log("{ loading, error, data }:", { loading, error, data });
  return (
    <div className="flex p-4 gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex-grow-2 bg-base shadow-lg shadow-overlay-2 rounded-md  w-[60%]  ">
          <div className=" h-70 w-full relative ml-2 mt-2">
            <img
              src={"/reforestation.jpg"}
              alt="reforestation"
              width="0"
              height={"0"}
              className="w-full h-full align-middle content-center rounded-t-md"
            />
          </div>
          <div className="p-10">
            <Text element="h1" as="h1" className="mb-4">
              {project?.projectId}
            </Text>
            <Text element="h3" as="h3">
              About
            </Text>
            <Text element="p" as="p" className="mb-4">
              {
                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              }
            </Text>
            <Text element="h3" as="h3" className="mb-4">
              <MdOutlineFolderCopy className="w-10 h-10 inline p-1 pb-2" />
              Generated credits
            </Text>
            <StepperDemo />
          </div>
        </div>
        <div className="flex-grow-2 bg-base shadow-lg shadow-overlay-2 rounded-md  w-[60%] p-10 ">
          <Text element="h1" as="h1" className=" mb-8">
            Project Details
          </Text>
          <div className="flex flex-wrap">
            <div className="w-1/2 ">
              <Text element="h4" as="h4">
                Project ID
              </Text>
              <Text element="p" as="p">
                {project?.id}
              </Text>
            </div>
            <div className="w-1/2">
              <Text element="h4" as="h4">
                Method
              </Text>
              <Text element="p" as="p">
                {project?.method}
              </Text>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2">
              <Text element="h4" as="h4">
                Category
              </Text>
              <Text element="p" as="p">
                {project?.category}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow-1 min-w-30">buy</div>
    </div>
  );
}
