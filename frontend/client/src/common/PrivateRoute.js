import React from 'react';
import {Redirect, Route} from "react-router-dom";


const PrivateRoute = ({component: ChildComponent, authenticated, ...rest}) => {
    return (<Route
        {...rest}
        render={props =>
            authenticated ? (
                <ChildComponent {...props} {...rest} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: {from: props.location}
                    }}
                />
            )
        }
    />)
};

export default PrivateRoute