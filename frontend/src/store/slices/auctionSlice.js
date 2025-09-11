import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Utility function to get auth headers with token
const getAuthConfig = (extraHeaders = {}) => {
  const token = localStorage.getItem("token");
  return {
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...extraHeaders,
    },
  };
};

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    loading: false,
    itemDetail: {},
    auctionDetail: {},
    auctionBidders: {},
    myAuctions: [],
    allAuctions: [],
  },
  reducers: {
    createAuctionRequest(state) { state.loading = true; },
    createAuctionSuccess(state) { state.loading = false; },
    createAuctionFailed(state) { state.loading = false; },

    getAllAuctionItemRequest(state) { state.loading = true; },
    getAllAuctionItemSuccess(state, action) {
      state.loading = false;
      state.allAuctions = action.payload;
    },
    getAllAuctionItemFailed(state) { state.loading = false; },

    getAuctionDetailRequest(state) { state.loading = true; },
    getAuctionDetailSuccess(state, action) {
      state.loading = false;
      state.auctionDetail = action.payload.auctionItem;
      state.auctionBidders = action.payload.bidders;
    },
    getAuctionDetailFailed(state) { state.loading = false; },

    getMyAuctionsRequest(state) { state.loading = true; state.myAuctions = []; },
    getMyAuctionsSuccess(state, action) { state.loading = false; state.myAuctions = action.payload; },
    getMyAuctionsFailed(state) { state.loading = false; state.myAuctions = []; },

    deleteAuctionItemRequest(state) { state.loading = true; },
    deleteAuctionItemSuccess(state) { state.loading = false; },
    deleteAuctionItemFailed(state) { state.loading = false; },

    republishItemRequest(state) { state.loading = true; },
    republishItemSuccess(state) { state.loading = false; },
    republishItemFailed(state) { state.loading = false; },

    resetSlice(state) { state.loading = false; },
  },
});

// ✅ API Actions
export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemRequest());
  try {
    const { data } = await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/auctionitem/allitems",
      getAuthConfig()
    );
    dispatch(auctionSlice.actions.getAllAuctionItemSuccess(data.items));
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemFailed());
    console.error("Fetch all auction items error:", error.response?.data || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const getMyAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getMyAuctionsRequest());
  try {
    const { data } = await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/auctionitem/myitems",
      getAuthConfig()
    );
    dispatch(auctionSlice.actions.getMyAuctionsSuccess(data.items));
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(auctionSlice.actions.getMyAuctionsFailed());
    console.error("Fetch my auctions error:", error.response?.data || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const getAuctionDetail = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.getAuctionDetailRequest());
  try {
    const { data } = await axios.get(
      `https://auction-platform-backend-8dj2.onrender.com/api/v1/auctionitem/auction/${id}`,
      getAuthConfig()
    );
    dispatch(auctionSlice.actions.getAuctionDetailSuccess(data));
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(auctionSlice.actions.getAuctionDetailFailed());
    console.error("Fetch auction detail error:", error.response?.data || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const createAuction = (data) => async (dispatch) => {
  dispatch(auctionSlice.actions.createAuctionRequest());
  try {
    const { data: response } = await axios.post(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/auctionitem/create",
      data,
      getAuthConfig({ "Content-Type": "multipart/form-data" })
    );
    dispatch(auctionSlice.actions.createAuctionSuccess());
    toast.success(response.message);
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(auctionSlice.actions.createAuctionFailed());
    toast.error(error.response?.data?.message || "Failed to create auction");
    console.error("Create auction error:", error.response?.data || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const republishAuction = (id, data) => async (dispatch) => {
  dispatch(auctionSlice.actions.republishItemRequest());
  try {
    const { data: response } = await axios.put(
      `https://auction-platform-backend-8dj2.onrender.com/api/v1/auctionitem/item/republish/${id}`,
      data,
      getAuthConfig({ "Content-Type": "application/json" })
    );
    dispatch(auctionSlice.actions.republishItemSuccess());
    toast.success(response.message);
    dispatch(getMyAuctionItems());
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(auctionSlice.actions.republishItemFailed());
    toast.error(error.response?.data?.message || "Failed to republish auction");
    console.error("Republish auction error:", error.response?.data || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const deleteAuction = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.deleteAuctionItemRequest());
  try {
    const { data: response } = await axios.delete(
      `https://auction-platform-backend-8dj2.onrender.com/api/v1/auctionitem/delete/${id}`,
      getAuthConfig()
    );
    dispatch(auctionSlice.actions.deleteAuctionItemSuccess());
    toast.success(response.message);
    dispatch(getMyAuctionItems());
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(auctionSlice.actions.deleteAuctionItemFailed());
    toast.error(error.response?.data?.message || "Failed to delete auction");
    console.error("Delete auction error:", error.response?.data || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export default auctionSlice.reducer;
