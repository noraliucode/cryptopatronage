import React from "react";
import "./App.css";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Layout } from "./layout";
import { CreatorsPage } from "./page/creatorsPage";
import { TabsMain } from "./components/Tabs";
import { AboutPage } from "./page/aboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/manage"
          element={
            // TODO: refactor to render router
            <Layout>
              <TabsMain />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
