import {Alert} from "react-bootstrap";
import React from "react";

export const GoogleError = () => {
    return (<div>
        <Alert variant="danger">
            UPS! Something went wrong
        </Alert>
    </div>)
};


export const EmptyData = (props) => {
    return (<div>
        <Alert variant="primary">
            UPS! You don't have any {props.data} yet.
        </Alert>
    </div>)
};