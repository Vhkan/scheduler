import React from "react";
import { render, cleanup } from "@testing-library/react";
import Appointment from "components/Appointment";

afterEach(cleanup);

//wrapping up in a 'describe' to group a series of tests
describe("Appointment", () => {

  it("Renders without crashing", () => {
    render(<Appointment />);
  });
  
});
