import React, { Component } from 'react'
import './App.css';
import Layer from './Layer';
import {Router,Route,Switch,Link } from "react-router-dom";
import Bisection from './Root/Bisection'
import Falseposition from './Root/Falseposition';
import Newton from './Root/Newton';
import Onepoint from './Root/Onepoint';
import Secant from './Root/Secant';


export default class App extends Component {
  render() {
      return (
            <div className="App">
              <React.Fragment>
                <Switch>
                  
                  <Route exact path="/" component={Layer}/>
                  <Route exact path="/Bisection" component={Bisection}/>
                  <Route exact path="/Falseposition" component={Falseposition}/>
                  <Route exact path="/Newton" component={Newton}/>
                  <Route exact path="/Onepoint" component={Onepoint}/>
                  <Route exact path="/Secant" component={Secant}/>

                </Switch>
              </React.Fragment>           
            </div>
             
          
      )
  }
}
