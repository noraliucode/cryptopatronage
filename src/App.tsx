import "./i18n/config";
import React from "react";
import "./App.css";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Layout } from "./layout";
import { CreatorsPage } from "./page/creatorsPage";
import { Manage } from "./page/ManagePage";
import { AboutPage } from "./page/aboutPage";
import Create from "./components/Create";
import HowToSupport from "./page/howToSupportPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/manage"
          element={
            // TODO: refactor to render router
            <Layout>
              <Manage />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <CreatorsPage />
            </Layout>
          }
        />
        <Route
          path="/creators/:address"
          element={
            <Layout>
              <CreatorsPage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/create"
          element={
            <Layout>
              <Create />
            </Layout>
          }
        />
        <Route
          path="/how-to-support"
          element={
            <Layout>
              <HowToSupport />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
