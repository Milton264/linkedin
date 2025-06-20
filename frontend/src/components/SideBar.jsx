import React from "react";
import PeopleCard from "./PeopleCard";
import TrendingSideCard from "./TrendingSideCard";

const SideBar = ({ dark }) => (
  <div className="flex flex-col gap-4 w-full md:w-64">
    <PeopleCard dark={dark} />
    <TrendingSideCard dark={dark} />
  </div>
);

export default SideBar;
