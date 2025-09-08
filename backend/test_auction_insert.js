const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MERN_AUCTION_PLATFORM', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the auction schema
const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  category: String,
  condition: String,
  currentBid: { type: Number, default: 0 },
  startTime: String,
  endTime: String,
  image: {
    public_id: String,
    url: String,
  },
  createdBy: mongoose.Schema.Types.ObjectId,
  bids: Array,
  highestBidder: mongoose.Schema.Types.ObjectId,
  commissionCalculated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Auction = mongoose.model('Auction', auctionSchema);

// Create a test auction item
const testAuction = new Auction({
  title: "Test Auction Item",
  description: "This is a test auction item created for testing purposes.",
  startingBid: 100,
  category: "Electronics",
  condition: "New",
  currentBid: 0,
  startTime: "2023-10-28T10:00:00Z",
  endTime: "2023-10-29T10:00:00Z",
  image: {
    public_id: "test_image_public_id",
    url: "https://via.placeholder.com/300x200?text=Auction+Item"
  },
  createdBy: new mongoose.Types.ObjectId(), // Random user ID
  bids: [],
  highestBidder: null,
  commissionCalculated: false
});

// Insert the test auction
testAuction.save()
  .then(result => {
    console.log("Test auction created successfully:", result);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error("Error creating test auction:", error);
    mongoose.connection.close();
  });
