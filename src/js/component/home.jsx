import React from "react";
import Input from "./input";

//create your first component
const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-center mt-5">Todo List!</h1>
      <Input />
    </div>
  );
};

export default Home;
