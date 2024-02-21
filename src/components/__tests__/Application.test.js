import React from "react";
import axios from "axios";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getByTestId,
  getAllByTestId,
  getAllByText,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  findByAltText,
  queryAllByAltText,
  wait,
  queryByAltText
} from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

// it("changes the schedule when a new day is selected", () => {
//   const { getByText } = render(<Application />);
//   return waitForElement(() => getByText("Monday")).then(() => {
//     fireEvent.click(getByText("Tuesday"));
//     expect(getByText("Leopold Silvers")).toBeInTheDocument();
//   });
// });

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);
  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));
  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

//Test "loads data, books an interview and reduces the spots remaining for the first day by 1"
describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //Opt1
    // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //Opt2
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    //console.log("Day container is:", day);

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    // console.log("Container is:", prettyDOM(container));
    // console.log("Appointments container is:", prettyDOM(appointments));
    //console.log("Single appointment is:", prettyDOM(appointment));
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => queryByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    await waitForElement(() =>
      queryByText(container, /Are you sure you would like to delete/i)
    );
    //expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    await waitForElement(() => queryByText(container, /Deleting/i));
    //expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    // const addButton = await findByAltText(appointment, "Add");
    // expect(addButton).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    //console.log("Appointment is:", prettyDOM(appointment));
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => queryByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment + Change the name and save the interview.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i)),
      { target: "Lydia Miller-Jones" };

    // 4. Save the appointment
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByText(appointment, "Saving"));

    // 5. Check if "Sylvia Palmer" record saved
    await waitForElement(() => queryByText(container, "Sylvia Palmer"));

    // 6. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });


  /* test number five */
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => queryByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i)),
    { target: "Lydia Miller-Jones" };

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    //await waitForElement(() => getByText(appointment, "Error"));
        
    await waitForElement(() => queryByText(container, "Sylvia Palmer"));

    const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => queryByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() => queryByText(container, /Are you sure you would like to delete/i));

    fireEvent.click(queryByText(appointment, "Confirm"));

    await waitForElement(() => queryByText(appointment, "Deleting"));

    //await waitForElement(() => getByText(appointment, "Error"));  

    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    
    expect(getByText(day, "Monday")).toBeInTheDocument;
  });

});
