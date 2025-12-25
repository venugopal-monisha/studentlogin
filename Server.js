const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST ROUTE
app.post("/add-user", async (req, res) => {
    try {
        const { name, email, password, phone,usn } = req.body;

        
        const newUser = new User({
            name,
            email,
            password,
            phone,
            usn,
                   });

        await newUser.save();
        res.json({ message: "User registered successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Test route
// app.get("/monisha", (req, res) => {
//   res.send("Hii");
// });
app.get("/get-users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching users" });
    }
})

app.put("/update-user/:email", async (req, res) => {
    try {
        const userEmail = req.params.email;
        const updatedData = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            updatedData,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            message: "User updated successfully!",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: " Error updating user" });
    }
});


app.delete("/delete-user/:email", async (req, res) => {
    try {
        const userEmail = req.params.email;

        const deletedUser = await User.findOneAndDelete({ email: userEmail });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User deleted successfully!",
            deletedUser,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting user" });
    }
});
// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Student Management API Server',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      images: '/api/images/:imageName'
    }
  });
});

app.get("/images/:imgName", (req, res) => {
  const imgPath = path.join(__dirname, "images", req.params.imgName);
  res.sendFile(imgPath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: "Image not found" });
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` Images directory: ${path.join(__dirname, 'images')}`);
  console.log(` Access server at: http://localhost:${PORT}`);
});

module.exports = app;