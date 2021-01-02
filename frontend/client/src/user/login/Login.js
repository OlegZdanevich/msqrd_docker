import React, {Component} from 'react';
import './Login.css';
import {GOOGLE_AUTH_URL} from '../../constants';
import {Redirect} from 'react-router-dom'
import googleLogo from '../../img/google-logo.png';
import Alert from 'react-s-alert';
import Button from "react-bootstrap/Button";

class Login extends Component {
    componentDidMount() {
        if(this.props.location.state && this.props.location.state.error) {
            setTimeout(() => {
                Alert.error(this.props.location.state.error, {
                    timeout: 5000
                });
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: {}
                });
            }, 100);
        }
    }
    
    render() {
        if(this.props.authenticated) {
            return <Redirect
                to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>;            
        }

        return (
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Login to MSQRD</h1>
                    <SocialLogin />
                </div>
            </div>
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <Button variant="outline-primary" href={GOOGLE_AUTH_URL} className="login"><img className="icon"
                                                                                            src={googleLogo}
                                                                                            alt="Google"/> Log in with
                Google</Button>
        );
    }
}

export default Login
