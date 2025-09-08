import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="bg-card mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
              <img
                src={user.profileImage?.url}
                alt="/imageHolder.jpg"
                className="w-36 h-36 rounded-full"
              />

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
              <label className="block text-sm font-medium text-foreground">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue={user.userName}
                      className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="text"
                      defaultValue={user.email}
                      className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <input
                      type="number"
                      defaultValue={user.phone}
                      className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={user.address}
                      className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Role
                    </label>
                    <input
                      type="text"
                      defaultValue={user.role}
                      className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Joined On
                    </label>
                    <input
                      type="text"
                      defaultValue={user.createdAt?.substring(0, 10)}
                      className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {user.role === "Auctioneer" && (
                <div className="mb-6 w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-foreground">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.paymentMethods.bankTransfer.bankName}
                        className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        Bank Account (IBAN)
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.bankTransfer.bankAccountNumber
                        }
                        className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        User Name On Bank Account
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.bankTransfer.bankAccountName
                        }
                        className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        Easypaisa Account Number
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.easypaisa.easypaisaAccountNumber
                        }
                        className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        Paypal Email
                      </label>
                      <input
                        type="text"
                        defaultValue={user.paymentMethods.paypal.paypalEmail}
                        className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4">
                  Other User Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.role === "Auctioneer" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground">
                          Unpaid Commissions
                        </label>
                        <input
                          type="text"
                          defaultValue={user.unpaidCommission}
                          className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                          disabled
                        />
                      </div>
                    </>
                  )}
                  {user.role === "Bidder" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground">
                          Auctions Won
                        </label>
                        <input
                          type="text"
                          defaultValue={user.auctionsWon}
                          className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground">
                          Money Spent
                        </label>
                        <input
                          type="text"
                          defaultValue={user.moneySpent}
                          className="w-full mt-1 p-2 border-border rounded-md focus:outline-none bg-transparent text-foreground"
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default UserProfile;
