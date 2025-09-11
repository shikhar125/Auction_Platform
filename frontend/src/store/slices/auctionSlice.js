import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Axios instance
const API = axios.create({
  baseURL: "https://auction-platform-backend-8dj2.onrender.com/api/v1",
  withCredentials: true,
});

// ✅ Token getter
const getAuthConfig = (extraHeaders = {}) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...extraHeaders,
    },
    withCredentials: true,
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
    createAuctionRequest: (state) => { state.loading = true; },
    createAuctionSuccess: (state) => { state.loading = false; },
    createAuctionFailed: (state) => { state.loading = false; },

    getAllAuctionItemRequest: (state) => { state.loading = true; },
    getAllAuctionItemSuccess: (state, action) => {
      state.loading = false;
      state.allAuctions = action.payload;
    },
    getAllAuctionItemFailed: (state) => { state.loading = false; },

    getAuctionDetailRequest: (state) => { state.loading = true; },
    getAuctionDetailSuccess: (state, action) => {
      state.loading = false;
      state.auctionDetail = action.payload.auctionItem;
      state.auctionBidders = action.payload.bidders;
    },
    getAuctionDetailFailed: (state) => { state.loading = false; },

    getMyAuctionsRequest: (state) => { state.loading = true; state.myAuctions = []; },
    getMyAuctionsSuccess: (state, action) => {
      state.loading = false;
      state.myAuctions = action.payload;
    },
    getMyAuctionsFailed: (state) => { state.loading = false; state.myAuctions = []; },

    deleteAuctionItemRequest: (state) => { state.loading = true; },
    deleteAuctionItemSuccess: (state) => { state.loading = false; },
    deleteAuctionItemFailed: (state) => { state.loading = false; },

    republishItemRequest: (state) => { state.loading = true; },
    republishItemSuccess: (state) => { state.loading = false; },
    republishItemFailed: (state) => { state.loading = false; },

    resetSlice: (state) => { state.loading = false; },
  },
});

export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemRequest());
  try {
    const response = await API.get("/auctionitem/allitems", getAuthConfig());
    dispatch(auctionSlice.actions.getAllAuctionItemSuccess(response.data.items));
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemFailed());
    console.error("Fetch all auctions error:", error.response?.data?.message || error.message);
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const getMyAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getMyAuctionsRequest());
  try {
    const response = await API.get("/auctionitem/myitems", getAuthConfig());
    dispatch(auctionSlice.actions.getMyAuctionsSuccess(response.data.items));
  } catch (error) {
    dispatch(auctionSlice.actions.getMyAuctionsFailed());
    console.error("Fetch my auctions error:", error.response?.data?.message || error.message);
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const getAuctionDetail = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.getAuctionDetailRequest());
  try {
    const response = await API.get(`/auctionitem/auction/${id}`, getAuthConfig());
    dispatch(auctionSlice.actions.getAuctionDetailSuccess(response.data));
  } catch (error) {
    dispatch(auctionSlice.actions.getAuctionDetailFailed());
    console.error("Fetch auction detail error:", error.response?.data?.message || error.message);
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const createAuction = (data) => async (dispatch) => {
  dispatch(auctionSlice.actions.createAuctionRequest());
  try {
    const response = await API.post("/auctionitem/create", data, getAuthConfig({ "Content-Type": "multipart/form-data" }));
    dispatch(auctionSlice.actions.createAuctionSuccess());
    toast.success(response.data.message);
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(auctionSlice.actions.createAuctionFailed());
    const message = error.response?.data?.message || "Failed to create auction";
    toast.error(message);
    console.error("Create auction error:", message);
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const republishAuction = (id, data) => async (dispatch) => {
  dispatch(auctionSlice.actions.republishItemRequest());
  try {
    const response = await API.put(`/auctionitem/item/republish/${id}`, data, getAuthConfig({ "Content-Type": "application/json" }));
    dispatch(auctionSlice.actions.republishItemSuccess());
    toast.success(response.data.message);
    dispatch(getMyAuctionItems());
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(auctionSlice.actions.republishItemFailed());
    const message = error.response?.data?.message || "Failed to republish auction";
    toast.error(message);
    console.error("Republish auction error:", message);
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const deleteAuction = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.deleteAuctionItemRequest());
  try {
    const response = await API.delete(`/auctionitem/delete/${id}`, getAuthConfig());
    dispatch(auctionSlice.actions.deleteAuctionItemSuccess());
    toast.success(response.data.message);
    dispatch(getMyAuctionItems());
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(auctionSlice.actions.deleteAuctionItemFailed());
    const message = error.response?.data?.message || "Failed to delete auction";
    toast.error(message);
    console.error("Delete auction error:", message);
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export default auctionSlice.reducer;

