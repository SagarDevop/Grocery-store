const User = require('../models/User');

/**
 * Get full user profile
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('recently_viewed');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Fetch Profile Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update basic profile info
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, profileImage } = req.body;
        const user = await User.findById(req.user._id);
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Manage Addresses (Add/Edit/Delete/SetDefault)
 */
exports.manageAddress = async (req, res) => {
    try {
        const { action, addressId, addressData } = req.body;
        const user = await User.findById(req.user._id);

        if (action === 'ADD') {
            if (addressData.isDefault) {
                user.addresses.forEach(a => a.isDefault = false);
            }
            user.addresses.push(addressData);
        } else if (action === 'UPDATE') {
            const addr = user.addresses.id(addressId);
            if (addr) {
                Object.assign(addr, addressData);
                if (addressData.isDefault) {
                    user.addresses.forEach(a => {
                        if (a._id.toString() !== addressId) a.isDefault = false;
                    });
                }
            }
        } else if (action === 'DELETE') {
            user.addresses.pull(addressId);
        } else if (action === 'SET_DEFAULT') {
            user.addresses.forEach(a => {
                a.isDefault = a._id.toString() === addressId;
            });
        }

        await user.save();
        res.status(200).json({ message: "Address book updated", addresses: user.addresses });
    } catch (error) {
        console.error("Manage Address Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Change User Password
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const bcrypt = require('bcryptjs');
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
/**
 * Get profile by email (used for refresh)
 */
exports.getProfileByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Fetch Profile By Email Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
