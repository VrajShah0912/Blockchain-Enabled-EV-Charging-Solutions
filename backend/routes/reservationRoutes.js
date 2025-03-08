const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation"); // Assuming you have a Reservation model

// Create a new reservation
router.post("/create", async (req, res) => {
    try {
        const { userId, eventId, date, time, guests } = req.body;

        const newReservation = new Reservation({
            userId,
            eventId,
            date,
            time,
            guests
        });

        await newReservation.save();
        res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error creating reservation", error: error.message });
    }
});

// Get all reservations
router.get("/all", async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations", error: error.message });
    }
});

// Get reservation by ID
router.get("/:id", async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservation", error: error.message });
    }
});

// Update reservation by ID
router.put("/:id", async (req, res) => {
    try {
        const { date, time, guests } = req.body;
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { date, time, guests },
            { new: true }
        );
        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json({ message: "Reservation updated successfully", reservation: updatedReservation });
    } catch (error) {
        res.status(500).json({ message: "Error updating reservation", error: error.message });
    }
});

// Delete reservation by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reservation", error: error.message });
    }
});

module.exports = router;
