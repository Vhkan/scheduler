import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";

import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";

export default function Appointment(props) {
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {props.interview ?
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => console.log("CONFIRM")}
          onEdit={() => console.log("EDIT")}
        />
        :
        <Empty onAdd={() => console.log("CREATE")} />}
    </article>
  );
}
