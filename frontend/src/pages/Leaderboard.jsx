import Spinner from "@/custom-components/Spinner";
import React from "react";
import { useSelector } from "react-redux";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex flex-col min-[340px]:flex-row min-[340px]:gap-2 mb-5">
              <h1
                className={`text-primary text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
              >
                Bidders Leaderboard
              </h1>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-card border my-5 border-border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left text-foreground">Profile Pic</th>
                    <th className="py-2 px-4 text-left text-foreground">Username</th>
                    <th className="py-2 px-4 text-left text-foreground">Bid Expenditure</th>
                    <th className="py-2 px-4 text-left text-foreground">Auctions Won</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {leaderboard.slice(0, 100).map((element, index) => {
                    return (
                      <tr
                        key={element._id}
                        className="border-b border-border"
                      >
                        <td className="flex gap-2 items-center py-2 px-4">
                          <span className="text-muted-foreground font-semibold text-xl w-7 hidden sm:block">
                            {index + 1}
                          </span>
                          <span>
                            <img
                              src={element.profileImage?.url}
                              alt={element.username}
                              className="h-12 w-12 object-cover rounded-full"
                            />
                          </span>
                        </td>
                        <td className="py-2 px-4">{element.userName}</td>
                        <td className="py-2 px-4">{element.moneySpent}</td>
                        <td className="py-2 px-4">{element.auctionsWon}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Leaderboard;
