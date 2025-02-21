import React from "react";
 import { Priority } from "@/state/api";
import ReusablePriorityPage from "../reusablepriorityPage";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
};

export default Urgent;