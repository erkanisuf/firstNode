import React, { useContext, useState } from "react";
import { MyContext } from "./Context/Context";
import "./App.css";

import Products from "./components/Products/Products";
import Layout from "./Layout/Layout";
import Profile from "./components/User/Profile";
import { Switch, Route } from "react-router-dom";
import ProductID from "./components/Products/ProductID/ProductID";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import Login from "./components/User/Login";
import PrivateRoute from "./PrivateRoute";
import AdminPanel from "./components/User/AdminPanel";
import CheckOut from "./components/CheckOut/CheckOut";
import Success from "./components/CheckOut/Success";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51HugH2HIfBlErhlnFlqyz57Nft2p700zznt5h5Fj0Up8rEqQgyahdB2Dw8WNjJPpxKbNngpGAsHjBnv6gIOGjXAb0064AxWTjS"
);

function App() {
  const { state, dispatch } = useContext(MyContext);

  const kur = "apple";
  const [openLogin, setopenLogin] = useState(true);
  return (
    <Layout>
      <div className="App">
        <button onClick={() => console.log(state)}>c</button>

        <Breadcrumbs />

        <Switch>
          <Route exact path="/">
            <Products />
          </Route>
          <Route path="/products/:id">
            <ProductID />
          </Route>

          <PrivateRoute exact path="/userprofile" component={Profile} />

          {/* <Route path="/userprofile">
           <Profile />
          
          </Route> */}
          <Route path="/login">
            <h1> Please log in to use this section.</h1>
            <Login
              openLogin={openLogin}
              handleClose={() => setopenLogin(false)}
            />
          </Route>
          <Route path="/adminpanel">
            <AdminPanel />
          </Route>
          <Route path="/checkout">
            <Elements stripe={stripePromise}>
              <CheckOut />
            </Elements>
          </Route>
          <Route path="/finishedpaid">
            <Success />
          </Route>
        </Switch>
      </div>
    </Layout>
  );
}

export default App;
