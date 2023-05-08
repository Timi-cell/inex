import React from "react";
import Header from "../../components/navigation/Header";
import "./Home.scss";
import HeroImg from "../../assets/images/wallet.png";
import { ShowOnLogOut } from "../../components/hiddenLinks/HiddenLinks";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <section className="hero">
        <div className="hero-section">
          <div>
            <h2>Welcome to InEx.</h2>
            <p>
              Calculation & Tracking of Income and Expenses made easier with InEx.
            </p>
          </div>
          <div className="mobileImg">
            <img src={HeroImg} alt="a wallet" />
          </div>
          <div className="hero-content">
            <p>InEx can...</p>
            <p>
              - <i>Calculate your income and expenses.</i>
            </p>
            <p>
              - <i>Tell you the rate at which you are spending</i>.
            </p>
            <p>
              -{" "}
              <i>
                Clear out the confusion on what you spent on or how much you are
                earning.
              </i>
            </p>
          </div>
          <ShowOnLogOut>
            <div className="hero-end">
              <Link to="/register">
                <button className="--btn hero-btn">REGISTER</button>
              </Link>
              <span>NOW TO GET STARTED.</span>
            </div>
          </ShowOnLogOut>
        </div>
        <div className="desktopImg">
          <img src={HeroImg} alt="a wallet" />
        </div>
      </section>
    </div>
  );
};

export default Home;
