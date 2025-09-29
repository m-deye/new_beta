// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import OfferCard from "./OfferCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ListeOffres from "./api/OffresList";
import AppelsOffres from "./AppelsOffres";
import MainSection from "./MainSection";

import Footer from "./Footer";
import Inscription from "./components/Inscription"; // Importez le composant Inscription
import Login from "./components/Login";
import MainComponent from "./components/main";

import Maintemplate from "./components/maintemplate";
import Offreprioritaire from "./components/offreprioritaire";

import ClientDashboard from "./components/client/ClientDashboard";
import CandidatDashboard from "./components/Candidat/CandidatDashboard";
import Internationaux from "./components/TypesApplesOffre/Internationaux";
import Consultations from "./components/TypesApplesOffre/Consultations";
import Locaux from "./components/TypesApplesOffre/Locaux";

import ManifestationsIntérêts from "./components/TypesApplesOffre/ManifestationsIntérêts";
import OffreEmploi from "./components/annonces/OffreEmploi";

import ApplesOffre from "./components/annonces/ApplesOffre";
import AvisInfos from "./components/annonces/AvisInfos";

import ApplesOffres from "./components/ListCompler/ApplesOffres";

import OffresEmplois from "./components/ListCompler/OffresEmplois";
import OffresEmploisSpecial from "./components/ListCompler/OffresEmploisSpecial";

import Avis_Infos from "./components/ListCompler/Avis_Infos";
import ClientForm from "./components/client/CreeClient";

import PasswordResetRequest from "./PasswordResetRequest";
import PasswordResetConfirm from "./PasswordResetConfirm";

import Recrutement from "./Recrutement";

import ConseilsRH from "./ConseilsRH";
import Assistance from "./Assistance";
import Contact from "./Contact";
import DetailOffreEmploi from "./DetailOffreEmploi";
import DetailAppleOffre from "./DetailAppleOffre";
import DetailAvisInfo from "./DetailAvisInfo";

import ClientSpeciele from "./ClientSpeciele";
import ClientSpecielApple from "./ClientSpecielApple";

import ClientSpecielAvis from "./ClientSpecielAvis";

import CVFinder from "./basecv";

import TestimonialForm from "./TestimonialForm";

import Psychotechniques from "./Psychotechniques";
import Beta_mr from "./beta_mr";
import Beta_conseil from "./beta_conseil";

import { SimpleGrid, Box } from "@chakra-ui/react";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page principale (avec template) */}
        <Route
          path="/"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Header />
              <Navbar />
              <OfferCard />
              <Maintemplate />
              <Footer />
            </div>
          }
        />

        {/* Route pour la page d'inscription (sans template) */}
        <Route path="/inscription" element={<Inscription />} />

        <Route path="/Login" element={<Login />} />
        {/* <Route path="/client-dashboard" element={<ClientDashboard />} /> */}
        <Route
          path="/candidat-dashboard/:username"
          element={<CandidatDashboard />}
        />
        <Route
          path="/client-dashboard/:username"
          element={<ClientDashboard />}
        />

        <Route
          path="/Recrutement"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Recrutement />{" "}
            </div>
          }
        />

        <Route
          path="/TestimonialForm"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <TestimonialForm />{" "}
            </div>
          }
        />

        <Route
          path="/ConseilsRH"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <ConseilsRH />{" "}
            </div>
          }
        />

        <Route
          path="/Assistance"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Assistance />{" "}
            </div>
          }
        />
        <Route
          path="/Contact"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Contact />{" "}
            </div>
          }
        />

        <Route
          path="/DetailOffreEmploi/:offreId"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <DetailOffreEmploi />{" "}
            </div>
          }
        />
        {/* <Route path="/ClientSpeciele/:client__nom" element={  <div className="App" style={{ backgroundColor: '#E7EFF7' }}><ClientSpeciele/> </div>} /> */}

        <Route
          path="/ClientSpeciele/:client__nom/:offreId"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <ClientSpeciele />
            </div>
          }
        />

        <Route
          path="/ClientSpecielApple/:client__nom/:offreId"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <ClientSpecielApple />
            </div>
          }
        />

        <Route
          path="/ClientSpecielAvis/:client__nom/:offreId"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <ClientSpecielAvis />
            </div>
          }
        />

        <Route
          path="/appel-offre/:id"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <DetailAppleOffre />{" "}
            </div>
          }
        />

        <Route
          path="/avis-infos/:id"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <DetailAvisInfo />{" "}
            </div>
          }
        />
        <Route
          path="/Internationaux"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <Internationaux />{" "}
            </div>
          }
        />
        <Route
          path="/Consultations"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <Consultations />{" "}
            </div>
          }
        />
        <Route
          path="/Locaux"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <Locaux />{" "}
            </div>
          }
        />
        <Route
          path="/ManifestationsIntérêts"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <ManifestationsIntérêts />{" "}
            </div>
          }
        />
        <Route
          path="/annonces_offreemp/:client__nom"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <OffreEmploi />{" "}
            </div>
          }
        />
        <Route
          path="/annonces_appleoffre/:client__nom"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <ApplesOffre />{" "}
            </div>
          }
        />
        <Route
          path="/annonces_avisinfos/:client__nom"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <AvisInfos />{" "}
            </div>
          }
        />

        <Route
          path="/listcompter_appeloffre"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <ApplesOffres />{" "}
            </div>
          }
        />

        <Route
          path="/listcompter_OffresEmplois"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <OffresEmplois />{" "}
            </div>
          }
        />
        <Route
          path="/listcompter_OffresEmplois_special"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <OffresEmploisSpecial />{" "}
            </div>
          }
        />
        <Route
          path="/Psychotechniques"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Psychotechniques />{" "}
            </div>
          }
        />
        <Route
          path="/basecv"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <CVFinder />{" "}
            </div>
          }
        />

        <Route
          path="/beta_mr"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <Beta_mr />{" "}
            </div>
          }
        />

        <Route
          path="/beta_conseil"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Beta_conseil />{" "}
            </div>
          }
        />

        <Route
          path="/listcompter_AvisInfos"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              <Avis_Infos />{" "}
            </div>
          }
        />
        <Route
          path="/PasswordResetRequest"
          element={<PasswordResetRequest />}
        />
        <Route
          path="/reset-password/:uidb64/:token"
          element={<PasswordResetConfirm />}
        />

        <Route
          path="/CreeClient"
          element={
            <div className="App" style={{ backgroundColor: "#E7EFF7" }}>
              {" "}
              <ClientForm />{" "}
            </div>
          }
        />
      </Routes>
    </Router>
    //    <MainSection />

    // < MainComponent />

    // < Offreprioritaire />
  );
}

export default App;
