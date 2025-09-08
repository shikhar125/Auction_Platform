import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard, MdDarkMode, MdLightMode } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Link } from "react-router-dom";

const SideDrawer = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-primary text-primary-foreground text-3xl p-2 rounded-md hover:bg-primary/80 lg:hidden"
      >
        <GiHamburgerMenu />
      </div>
      <div
        className={`w-[100%] sm:w-[300px] h-full fixed top-0 ${
          show ? "left-0" : "left-[-100%]"
        } transition-all duration-100 p-4 flex flex-col justify-between lg:left-0 border-r-[1px] border-r-border bg-background text-foreground`}
      >
        <div className="relative">
          <Link to={"/"}>
            <h4 className="text-2xl font-semibold mb-4 flex items-center">
              Bid<span className="text-primary">Storm</span>
              <button
                onClick={handleToggleTheme}
                className="ml-2 p-1 rounded hover:bg-accent transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
              </button>
            </h4>
          </Link>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to={"/auctions"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
              >
                <RiAuctionFill /> Auctions
              </Link>
            </li>
            <li>
              <Link
                to={"/leaderboard"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
              >
                <MdLeaderboard /> Leaderboard
              </Link>
            </li>
            {isAuthenticated && user && user.role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to={"/submit-commission"}
                    className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
                  >
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/create-auction"}
                    className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
                  >
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/view-my-auctions"}
                    className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user && user.role === "Super Admin" && (
                <li>
                  <Link
                    to={"/dashboard"}
                    className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
                  >
                    <MdDashboard /> Dashboard
                  </Link>
                </li>
            )}
          </ul>

          {!isAuthenticated ? (
            <>
              <div className="my-4 flex gap-2">
                <Link
                  to={"/sign-up"}
                  className="bg-primary font-semibold hover:bg-primary/80 text-xl py-1 px-4 rounded-md text-primary-foreground"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="text-muted-foreground bg-transparent border-muted-foreground border-2 hover:bg-background hover:text-accent-foreground font-bold text-xl py-1 px-4 rounded-md"
                >
                  Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="my-4 flex gap-4 w-fit" onClick={handleLogout}>
                <button className="bg-primary font-semibold hover:bg-primary/80 text-xl py-1 px-4 rounded-md text-primary-foreground">
                  Logout
                </button>
              </div>
            </>
          )}
          <hr className="mb-4 border-t-primary" />
          <ul className="flex flex-col gap-3">
            {isAuthenticated && (
              <li>
                <Link
                  to={"/me"}
                  className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
                >
                  <FaUserCircle /> Profile
                </Link>
              </li>
            )}
            <li>
              <Link
                to={"/how-it-works-info"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
              >
                <SiGooglesearchconsole /> How it works
              </Link>
            </li>
            <li>
              <Link
                to={"/about"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-primary hover:transition-all hover:duration-150"
              >
                <BsFillInfoSquareFill /> About Us
              </Link>
            </li>
          </ul>
          <IoMdCloseCircleOutline
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[28px] sm:hidden"
          />
        </div>

        <div>
          <div className="flex gap-2 items-center mb-2">
            <Link
              to="/"
              className="bg-card text-muted-foreground p-2 text-xl rounded-sm hover:text-primary"
            >
              <FaFacebook />
            </Link>
            <Link
              to="/"
              className="bg-card text-muted-foreground p-2 text-xl rounded-sm hover:text-primary"
            >
              <RiInstagramFill />
            </Link>
          </div>
          <Link
            to={"/contact"}
            className="text-muted-foreground font-semibold hover:text-primary hover:transition-all hover:duration-150"
          >
            Contact Us
          </Link>
          <p className="text-muted-foreground">&copy; BidStorm, LLC.</p>
          <p className="text-muted-foreground">
            Designed By Shikhar Upadhyay
          </p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;

