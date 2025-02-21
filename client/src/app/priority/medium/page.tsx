import React from "react";
 import { Priority } from "@/state/api";
import ReusablePriorityPage from "../reusablepriorityPage";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Medium} />;
};

export default Urgent;