import React from "react";
 import { Priority } from "@/state/api";
import ReusablePriorityPage from "../reusablepriorityPage";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
};

export default Urgent;