import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  title: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const StatusCard = ({ title, header, children }: Props) => {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {header}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default StatusCard;
